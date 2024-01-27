"use server"

import { revalidatePath } from "next/cache"
import { Order, Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { getStore } from "./store"

interface StoreOrder extends Order {
  productAmount: number
}

export type OrderStatus =
  | "Payment Confirmed"
  | "On Proccess"
  | "On Shipping"
  | "Arrived"
  | "Done"

export async function getStoreOrders(): Promise<StoreOrder[]> {
  type Keys =
    | "productAmount"
    | "id"
    | "invoice"
    | "total"
    | "created_at"
    | "user_email"
    | "status"

  const store = await getStore()
  const orders = await prisma.order.findMany({
    where: { products: { some: { product: { store_id: store?.id } } } },
    include: {
      _count: {
        select: { products: { where: { product: { store_id: store?.id } } } },
      },
    },
  })

  const storeOrders = orders.map((order) => ({
    ...order,
    productAmount: order._count.products,
  }))

  const filteredStoreOrders = storeOrders.map(
    (order) =>
      Object.keys(order)
        .filter((key) => key !== "_count")
        .reduce(
          (newOrder, key) => ({ ...newOrder, [key]: order[key as Keys] }),
          {}
        ) as StoreOrder
  )

  return filteredStoreOrders
}

export async function getStoreOrder(
  orderId: number
): Promise<Prisma.OrderGetPayload<{
  include: {
    user: true
    products: {
      include: { product: true }
    }
  }
}> | null> {
  const store = await getStore()
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      products: {
        where: { product: { store_id: store?.id } },
        include: { product: true },
      },
    },
  })

  return order
}

export async function updateOrderStatus({
  orderId,
  status,
}: {
  orderId: number
  status: OrderStatus
}) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    })
  } catch (error) {
    throw error
  }

  revalidatePath("/")
}
