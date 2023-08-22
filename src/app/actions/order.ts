"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getAllOrders(dateTime?: Date): Promise<
  Prisma.OrderGetPayload<{
    include: {
      products: { include: { images: true; category: true } }
      status: true
      _count: { select: { products: true } }
    }
  }>[]
> {
  const orders = await prisma.order.findMany({
    where: { created_at: dateTime && { lte: dateTime } },
    include: {
      products: { include: { images: true, category: true } },
      status: true,
      _count: { select: { products: true } },
    },
  })

  return orders
}

export async function getOrderDetails(
  orderId: number
): Promise<Prisma.OrderGetPayload<{
  include: { products: { include: { images: true } }; status: true }
}> | null> {
  const orderDetails = await prisma.order.findUnique({
    where: { id: orderId },
    include: { products: { include: { images: true } }, status: true },
  })
  return orderDetails
}
