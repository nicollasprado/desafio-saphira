import prisma from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

  if (item.quantity <= 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({}, { status: StatusCodes.NO_CONTENT });
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: { decrement: 1 } }, // ou: quantity: item.quantity - 1
  });

  return NextResponse.json(updated, { status: StatusCodes.OK });
}

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
