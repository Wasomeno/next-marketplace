import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { products: true },
  });
  return new Response(JSON.stringify(categories));
}

export async function POST(request: Request) {
  const res = await request.json();
  try {
    await prisma.category.create({
      data: {
        name: res.name,
        description: res.description,
        slug: res.slug,
        images: { createMany: { data: res.image_urls } },
      },
    });
    return NextResponse.json({ message: `Successfully added ${res.name}` });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
