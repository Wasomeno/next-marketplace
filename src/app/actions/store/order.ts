"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { getStore } from "./store"

export type OrderStatus =
  | "Payment Confirmed"
  | "On Proccess"
  | "On Shipping"
  | "Arrived"
  | "Done"

export async function getStoreOrders() {
  const store = await getStore()
  const orders = await prisma.order.findMany({
    where: { products: { some: { product: { store_id: store?.id } } } },
  })

  return orders
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
