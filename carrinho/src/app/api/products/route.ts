import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retorna os produtos
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número da página (começando por 0)
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: BAD REQUEST
 */
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

  const totalCount = await prisma.product.count();

  const offset = numPage * numLimit;
  const products = await prisma.product.findMany({
    skip: offset,
    take: numLimit,
  });

  return NextResponse.json(
    {
      products,
      totalCount,
    },
    { status: StatusCodes.OK }
  );
}
