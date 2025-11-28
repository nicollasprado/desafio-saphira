import prisma from "@/lib/prisma";
import updateCartTotals from "@/util/updateCartTotals";
import validateSchema from "@/util/validateSchema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const patchReqBodySchema = z.object({
  quantity: z.number().int().nonnegative(),
});

type TPatchReqBody = z.infer<typeof patchReqBodySchema>;

/**
 * @swagger
 * /api/cart:
 *   patch:
 *     tags:
 *       - Cart
 *     summary: Altera a quantidade de um produto do carrinho
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da instancia do item no carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       204:
 *         description: NO CONTENT
 *       400:
 *         description: BAD REQUEST
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: cartItemId } = await context.params;

  if (!cartItemId) {
    return NextResponse.json(
      { error: "cartItemId is missing" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const body: TPatchReqBody = (await req.json()) as TPatchReqBody;

  const errors = validateSchema(body, patchReqBodySchema);

  if (errors.length > 0) {
    return NextResponse.json({}, { status: StatusCodes.BAD_REQUEST });
  }

  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });

  if (!item) {
    return NextResponse.json(
      { error: "cart item not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  const { quantity } = body;

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return new NextResponse(null, { status: StatusCodes.NO_CONTENT });
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  await updateCartTotals(updated.cartId);

  return new NextResponse(null, { status: StatusCodes.NO_CONTENT });
}

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Retorna o carrinho do usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id do carrinho
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: BAD REQUEST
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cart = await prisma.cart.findUnique({
    where: {
      id,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    return NextResponse.json(
      { error: "cart not found" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  return NextResponse.json(cart, { status: StatusCodes.OK });
}

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove um produto do carrinho
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da instancia do item no carrinho
 *     responses:
 *       204:
 *         description: NO CONTENT
 *       400:
 *         description: BAD REQUEST
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "itemId is missing" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const item = await prisma.cartItem.findUnique({ where: { id } });

  if (!item) {
    return NextResponse.json(
      { error: "cart item not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  await prisma.cartItem.delete({ where: { id } });

  await updateCartTotals(item.cartId);

  return new NextResponse(null, { status: StatusCodes.NO_CONTENT });
}
