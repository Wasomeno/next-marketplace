import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { getStore } from "./store"

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
