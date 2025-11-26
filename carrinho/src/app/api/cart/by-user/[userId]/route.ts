import prisma from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/cart/by-user:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Retorna o carrinho do usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: id do usuário
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: BAD REQUEST
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "user not found" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const cart = await prisma.cart.findUnique({
    where: {
      ownerId: userId,
    },
  });

  return NextResponse.json(cart, { status: StatusCodes.OK });
}
