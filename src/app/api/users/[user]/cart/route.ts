import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { CartItem } from "@prisma/client";

export async function GET(request: Request, context: { params: any }) {
  const { user } = context.params;
  const userCart = await prisma.cart.findUnique({
    where: { user_email: user },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
  return NextResponse.json(!userCart ? [] : userCart?.items);
}

export async function POST(request: NextRequest, context: { params: any }) {
  const { user } = context.params;
  const body = await request.json();
  const cart = await prisma.cart.findUnique({
    where: { user_email: user },
    include: { items: true },
  });

  const itemExists = cart?.items.some(
    (item) => item.product_id === body.product.id
  );

  if (!cart) {
    try {
      await prisma.cart.create({
        data: {
          items: {
            create: {
              product: { connect: { id: parseInt(body.product.id) } },
              amount: parseInt(body.product.amount),
            },
          },
          user: { connect: { email: user } },
        },
      });
      return NextResponse.json({ message: "success" });
    } catch (error) {
      return NextResponse.error();
    }
  }

  if (cart && itemExists) {
    try {
      const cartItem = cart.items.find(
        (item: CartItem) => item.product_id === body.product.id
      );
      await prisma.cart.update({
        where: { user_email: user },
        data: {
          items: {
            update: {
              where: {
                id: cartItem?.id,
                product_id: parseInt(body.product.id),
              },
              data: {
                amount:
                  (cartItem?.amount as number) + parseInt(body.product.amount),
              },
            },
          },
        },
      });
      return NextResponse.json({ message: "success" });
    } catch (error) {
      return NextResponse.error();
    }
  }

  if (cart) {
    try {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            create: {
              product: { connect: { id: parseInt(body.product.id) } },
              amount: parseInt(body.product.amount),
            },
          },
        },
      });
      return NextResponse.json({ message: "success" });
    } catch (error) {
      return NextResponse.error();
    }
  }
}
