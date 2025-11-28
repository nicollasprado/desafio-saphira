import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import validateSchema from "@/util/validateSchema";
import prisma from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { CartItem } from "~/prisma/generated/prisma/client";
import updateCartTotals from "@/util/updateCartTotals";

const reqBodySchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().positive(),
});

type TReqBody = z.infer<typeof reqBodySchema>;

/**
 * @swagger
 * /api/cart/{id}/add-item:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Adiciona produto ao carrinho
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id do carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *           example:
 *             productId: "b3c4d5e6-...-ef01"
 *             quantity: 2
 *     responses:
 *       201:
 *         description: CREATED
 *       400:
 *         description: BAD REQUEST
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const body = (await req.json()) as TReqBody;

  const errors = validateSchema(body, reqBodySchema);

  if (errors.length > 0) {
    return NextResponse.json(errors, { status: 400 });
  }

  const { productId, quantity } = body;
  const { id: cartId } = await context.params;

  const cartItemExists = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId, productId },
    },
  });

  let returnObject: CartItem;

  if (cartItemExists) {
    returnObject = await prisma.cartItem.update({
      where: {
        id: cartItemExists.id,
      },
      data: {
        quantity: { increment: quantity },
      },
    });
  } else {
    returnObject = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  await updateCartTotals(cartId);

  return NextResponse.json(returnObject, { status: StatusCodes.CREATED });
}
