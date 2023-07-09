import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: any }) {
  const { user } = context.params;
  const userCart = await prisma.cart.findUnique({
    where: { user_email: user },
    include: { items: { include: { product: { include: { images: true } } } } },
  });

  return NextResponse.json(!userCart ? [] : userCart?.items);
}

export async function POST(request: Request, context: { params: any }) {
  const { user } = context.params;
  const body = await request.json();
  try {
    await prisma.cart.upsert({
      create: {
        items: {
          create: {
            product: { connect: { id: parseInt(body.product.id) } },
            amount: parseInt(body.product.amount),
          },
        },
        user: { connect: { email: user } },
      },
      update: {
        items: {
          create: {
            product: { connect: { id: parseInt(body.product.id) } },
            amount: parseInt(body.product.amount),
          },
        },
      },
      where: { user_email: user },
    });
    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.error();
  }
}
