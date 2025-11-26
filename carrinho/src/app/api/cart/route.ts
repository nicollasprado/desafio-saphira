import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import validator from "validator";
import validateSchema from "@/util/validateSchema";
import prisma from "@/lib/prisma";
import { CartItem } from "~/app/generated/prisma/client";
import { StatusCodes } from "http-status-codes";

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
