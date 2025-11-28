import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import z from "zod";
import validateSchema from "@/util/validateSchema";

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

  const offset = (numPage - 1) * numLimit;
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

const reqBodySchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  image_url: z.url().optional(),
});

type TReqBody = z.infer<typeof reqBodySchema>;

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Cria um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *                 description: Preço em centavos
 *               image_url:
 *                 type: string
 *                 format: uri
 *           example:
 *             name: "Tênis legal"
 *             price: 19990
 *             image_url: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: CREATED
 *       400:
 *         description: BAD REQUEST
 *       409:
 *         description: CONFLICT
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as TReqBody;

  const { name, price, image_url } = body;

  const errors = validateSchema(body, reqBodySchema);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: StatusCodes.BAD_REQUEST });
  }

  const exists = await prisma.product.findUnique({ where: { name } });
  if (exists) {
    return NextResponse.json(
      { error: "product with this name already exists" },
      { status: StatusCodes.CONFLICT }
    );
  }

  const created = await prisma.product.create({
    data: {
      name,
      price,
      image_url: image_url ?? "",
    },
  });

  return NextResponse.json(created, { status: StatusCodes.CREATED });
}
