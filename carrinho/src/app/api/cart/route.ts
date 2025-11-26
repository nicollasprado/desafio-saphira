import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import validator from "validator";
import validateSchema from "@/util/validateSchema";
import prisma from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { CartItem } from "~/prisma/generated/prisma/client";

const reqBodySchema = z.object({
  cartId: z
    .string()
    .refine((val) => validator.isUUID(val), { error: "cartdId must be UUID" }),
  productId: z.string().refine((val) => validator.isUUID(val), {
    error: "productId must be UUID",
  }),
  quantity: z.number().int().positive(),
});

type TReqBody = z.infer<typeof reqBodySchema>;

/**
 * @swagger
 * /api/cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Adiciona produto ao carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *               - productId
 *               - quantity
 *             properties:
 *               cartId:
 *                 type: string
 *                 format: uuid
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *           example:
 *             cartId: "e7a1f2d3-...-abcd"
 *             productId: "b3c4d5e6-...-ef01"
 *             quantity: 2
 *     responses:
 *       201:
 *         description: CREATED
 *       400:
 *         description: BAD REQUEST
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as TReqBody;

  const errors = validateSchema(req, "body", reqBodySchema);

  if (errors.length > 0) {
    return NextResponse.json(errors, { status: 400 });
  }

  const { cartId, productId, quantity } = body;

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

  return NextResponse.json(returnObject, { status: StatusCodes.CREATED });
}
