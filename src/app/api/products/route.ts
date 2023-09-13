import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true, images: { select: { image_url: true } } },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()
  try {
    await prisma.product.create({
      data: {
        images: { createMany: { data: body.image_urls } },
        name: body.name,
        description: body.description,
        stock: parseInt(body.stock),
        price: parseInt(body.price),
        slug: body.slug,
        category: { connect: { id: parseInt(body.category_id) } },
      },
    })
    return NextResponse.json({ message: "Successfully added product" })
  } catch (error) {
    return NextResponse.error()
  }
}
