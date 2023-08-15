"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getCartItems() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const cart = await prisma.cart.findUnique({
      where: { user_email: session?.user?.email as string },
      select: {
        items: { include: { product: { include: { images: true } } } },
        _count: { select: { items: true } },
      },
    });
    return { items: cart?.items, count: cart?._count.items };
  } else {
    return { items: [], count: 0 };
  }
}

export async function getCartItemsCount() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const cart = await prisma.cart.findUnique({
      where: { user_email: session?.user?.email as string },
      select: { _count: true },
    });
    return cart?._count.items;
  } else {
    return 0;
  }
}

export async function addToCart(productId: number, productAmount: number) {
  const session = await getServerSession(authOptions);
  const user = session?.user?.email as string;
  const cart = await prisma.cart.findUnique({
    where: { user_email: user },
    include: { items: true },
  });

  const itemExists = cart?.items.some((item) => item.product_id === productId);

  if (!cart) {
    try {
      await prisma.cart.create({
        data: {
          items: {
            create: {
              product: { connect: { id: productId } },
              amount: productAmount,
            },
          },
          user: { connect: { email: user } },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  if (cart && itemExists) {
    try {
      const cartItem = cart.items.find((item) => item.product_id === productId);
      await prisma.cart.update({
        where: { user_email: user },
        data: {
          items: {
            update: {
              where: {
                id: cartItem?.id,
                product_id: productId,
              },
              data: { amount: (cartItem?.amount as number) + 1 },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  try {
    await prisma.cart.update({
      where: { id: cart?.id },
      data: {
        items: {
          create: {
            product: { connect: { id: productId } },
            amount: productAmount,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
  revalidatePath("/cart");
}

export async function updateCartItem(cartItemId: number, amount: number) {
  try {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { amount: amount },
    });
  } catch (error) {
    throw error;
  }
  revalidatePath("/cart");
}

export async function removeFromCart(cartItemId: number) {
  try {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } catch (error) {
    throw error;
  }
  revalidatePath("/cart");
}
