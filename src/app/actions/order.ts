"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getOrderStatuses() {
  const statuses = await prisma.orderStatus.findMany()
  return statuses
}

export async function getOrders(dateTime?: Date): Promise<
  Prisma.OrderGetPayload<{
    include: {
      products: { include: { product: { include: { images: true } } } }
      status: true
      _count: { select: { products: true } }
    }
  }>[]
> {
  const orders = await prisma.order.findMany({
    where: { created_at: dateTime && { lte: dateTime } },
    include: {
      products: { include: { product: { include: { images: true } } } },
      status: true,
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
    status: true
  }
}> | null> {
  const orderDetails = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: { include: { product: { include: { images: true } } } },
      status: true,
    },
  })
  return orderDetails
}

export async function getRecentOrders(): Promise<
  | Prisma.OrderGetPayload<{
      include: {
        products: { include: { product: { include: { images: true } } } }
        status: true
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
      status: true,
      _count: { select: { products: true } },
    },
    take: 5,
  })
  return recentOrders
}

export async function updateOrderStatus({
  orderId,
  statusId,
}: {
  orderId: number
  statusId: number
}) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status_id: statusId,
      },
    })
  } catch (error) {
    throw error
  }

  revalidatePath("/")
}
