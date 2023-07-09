import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: any }) {
  const { category } = context.params;
  const categoryDetails = await prisma.category.findUnique({
    where: { slug: category },
    include: { products: true },
  });
  return new Response(JSON.stringify(categoryDetails));
}

export async function DELETE(request: Request, context: { params: any }) {
  const { categoryId } = context.params;
  try {
    await prisma.category.delete({
      where: { id: parseInt(categoryId) },
    });
  } catch (error) {
    return NextResponse.error();
  }
  return new Response(JSON.stringify({ message: "Success" }));
}

export async function PUT(request: Request, context: any) {
  const { category } = context.params;
  const req = await request.json();
  try {
    await prisma.category.update({
      where: { id: parseInt(category) },
      data: { name: req.name },
    });
  } catch (error) {
    return NextResponse.error();
  }
  return new Response(JSON.stringify({ message: "Success" }));
}
