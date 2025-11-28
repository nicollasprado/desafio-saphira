import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";

/**
 * @swagger
 * /api/cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Cria um carrinho para o usuario
 *     responses:
 *       201:
 *         description: CREATED
 *       500:
 *         description: INTERNAL SERVER ERROR
 */
export async function POST(req: NextRequest) {
  const cart = await prisma.cart.create({
    data: {},
    include: {
      cartItems: true,
    },
  });

  return NextResponse.json(cart, { status: StatusCodes.CREATED });
}
