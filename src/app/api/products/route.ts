import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true, images: { select: { image_url: true } } },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const res = await request.json();
  try {
    await prisma.product.create({
      data: {
        images: { createMany: { data: res.image_urls } },
        name: res.name,
        description: res.description,
        stock: parseInt(res.stock),
        price: parseInt(res.price),
        slug: res.slug,
        category: { connect: { id: parseInt(res.category_id) } },
      },
    });
    return NextResponse.json({ message: "Successfully added product" });
  } catch (error) {
    return NextResponse.error();
  }
}
