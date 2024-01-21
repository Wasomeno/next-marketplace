"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"

import { getUserStore } from "./user-details"

export type TOrderStatus =
  | "Payment Confirmed"
  | "On Shipping"
  | "On Proccess"
  | "Arrived"
  | "Done"

export async function getOrders(dateTime?: Date): Promise<
  Prisma.OrderGetPayload<{
    include: {
      products: { include: { product: { include: { images: true } } } }
      status: true
      _count: { select: { products: true } }
    }
  }>[]
> {
  const store = await getUserStore()

  const orders = await prisma.order.findMany({
    where: { products: { some: { product: { store_id: store?.id } } } },
    include: {
      products: {
        where: { product: { store_id: store?.id } },
        include: { product: { include: { images: true } } },
      },
      _count: { select: { products: true } },
    },
    orderBy: { created_at: "desc" },
  })
  return orders
}

export async function getOrder(
  orderId: number
): Promise<Prisma.OrderGetPayload<{
  include: {
    products: { include: { product: { include: { images: true } } } }
  }
}> | null> {
  const orderDetails = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: { include: { product: { include: { images: true } } } },
    },
  })
  return orderDetails
}

export async function getRecentOrders(): Promise<
  | Prisma.OrderGetPayload<{
      include: {
        products: { include: { product: { include: { images: true } } } }
        _count: { select: { products: true } }
      }
    }>[]
  | null
> {
  const timeNow = new Date()
  const timeDaysAgo = new Date()

  timeDaysAgo.setDate(timeNow.getDate() - 2)
  const recentOrders = await prisma.order.findMany({
    where: { created_at: { lte: timeNow, gte: timeDaysAgo } },
    include: {
      products: { include: { product: { include: { images: true } } } },
      _count: { select: { products: true } },
    },
    take: 5,
  })
  return recentOrders
}

type TCheckout = {
  cartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[]
  total: number
  invoice: string
}

export async function checkout({ cartItems, total, invoice }: TCheckout) {
  const session = await getServerSession()

  const orderProducts = cartItems.map((cartItem) => ({
    product_id: cartItem.product_id,
    total: cartItem.product.price * cartItem.amount,
    amount: cartItem.amount,
  }))

  try {
    await prisma.order
      .create({
        data: {
          invoice,
          user: { connect: { email: session?.user.email as string } },
          products: { createMany: { data: orderProducts } },
          total: total,
          status: "Payment Confirmed",
        },
      })
      .then(
        async () =>
          await prisma.cartItem.deleteMany({
            where: {
              id: {
                in: cartItems.map((cartItem) => cartItem.id),
              },
            },
          })
      )
  } catch (error) {
    throw error
  }
  revalidatePath("/")
}
