import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: any }) {
  const { productId } = context.params;
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { category: true },
  });
  return NextResponse.json(productDetails);
}

export async function PUT(request: Request, context: any) {
  const { productId } = context.params;
  const { name, stock, price, category } = await request.json();
  try {
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        name: name,
        stock: parseInt(stock),
        price: parseInt(price),
        category: { connect: { id: parseInt(category) } },
        image_keys: {},
      },
    });
  } catch (error) {
    return NextResponse.error();
  }
  return new Response(JSON.stringify({ message: "Success" }));
}
