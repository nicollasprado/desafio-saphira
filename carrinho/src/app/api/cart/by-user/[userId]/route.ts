import prisma from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

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
