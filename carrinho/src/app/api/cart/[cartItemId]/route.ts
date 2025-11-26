import prisma from "@/lib/prisma";
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
  { params }: { params: { cartItemId: string } }
) {
  const { cartItemId } = params;

  if (!cartItemId) {
    return NextResponse.json(
      { error: "cartItemId is missing" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const body: TPatchReqBody = (await req.json()) as TPatchReqBody;

  const errors = validateSchema(req, "body", patchReqBodySchema);

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
    return NextResponse.json({}, { status: StatusCodes.NO_CONTENT });
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return NextResponse.json(updated, { status: StatusCodes.NO_CONTENT });
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
  { params }: { params: { itemId: string } }
) {
  const { itemId } = params;

  if (!itemId) {
    return NextResponse.json(
      { error: "itemId is missing" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });

  if (!item) {
    return NextResponse.json(
      { error: "cart item not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  return NextResponse.json({}, { status: StatusCodes.NO_CONTENT });
}
