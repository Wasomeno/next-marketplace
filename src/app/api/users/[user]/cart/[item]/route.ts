import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: any }) {
  const body = await request.json();
  const { user } = context.params;
  try {
    await prisma.cartItem.create({
      data: {
        product: { connect: { id: body.product.id } },
        amount: body.product.amount,
        cart: {
          connectOrCreate: {
            where: { user_email: user },
            create: { user: { connect: { email: user } } },
          },
        },
      },
    });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PATCH(request: Request, context: { params: any }) {
  const body = await request.json();
  const { item } = context.params;
  try {
    await prisma.cartItem.update({
      where: { id: parseInt(item) },
      data: {
        amount: parseInt(body.amount),
      },
    });
    return NextResponse.json({ message: "Successfully updated cartItem" });
  } catch (error) {
    return NextResponse.error();
  }
}
