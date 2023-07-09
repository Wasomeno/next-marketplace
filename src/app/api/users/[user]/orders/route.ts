import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function generateOrderId() {
  const date = new Date();
  return `INV/${date.getFullYear()}/${date.getTime()}`;
}

export async function GET(request: Request, context: any) {
  const { user } = context.params;
  try {
    const orders = await prisma.order.findMany({
      where: { user: { contains: user } },
      include: { products: true, status: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request, context: any) {
  const { user } = context.params;
  const { products, total } = await request.json();
  try {
    Promise.all;
    await prisma.order
      .create({
        data: {
          id: generateOrderId(),
          user,
          products: { connect: products },
          total: parseInt(total),
          status: { connect: { id: 1 } },
        },
      })
      .then(
        async () => await prisma.cart.delete({ where: { user_email: user } })
      );
    return NextResponse.json({ message: "Successfully made an order" });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
