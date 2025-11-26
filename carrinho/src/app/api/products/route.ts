import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const errors: string[] = [];

  if (!page) errors.push("Page is required");
  if (!limit) errors.push("Limit is required");

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: StatusCodes.BAD_REQUEST });
  }

  const numPage = Number(page);
  const numLimit = Number(limit);

  const offset = numPage * numLimit;
  const products = await prisma.product.findMany({
    skip: offset,
    take: numLimit,
  });

  return NextResponse.json(products, { status: StatusCodes.OK });
}
