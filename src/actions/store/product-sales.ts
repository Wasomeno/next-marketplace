"use server"

import moment from "moment"

import { prisma } from "@/lib/prisma"

export async function getProductDailyStats(
  productId: number,
  day: string | number
) {
  const stats = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      _count: {
        select: {
          order_products: {
            where: { invoice: { created_at: { lt: new Date() } } },
          },
        },
      },
    },
  })
  return stats
}

export async function getProductWeeklyStats(
  productId: number,
  week: string | number
) {
  const stats = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      _count: {
        select: {
          order_products: {
            where: { invoice: { created_at: { lt: new Date() } } },
          },
        },
      },
    },
  })

  return stats
}

export async function getProductMonthlyStats(
  productId: number,
  month: string | number
) {
  const monthMoment = moment().month(month)

  const amountOfDays = monthMoment.daysInMonth()
  const salesData = []

  for (let i = 1; i <= amountOfDays; i++) {
    const daySales = await prisma.orderProduct.findMany({
      where: {
        product_id: productId,
        invoice: {
          created_at: {
            gte: moment()
              .month(month as number)
              .date(i)
              .startOf("day")
              .toDate(),
            lte: moment()
              .month(month as number)
              .date(i)
              .endOf("day")
              .toDate(),
          },
        },
      },
    })
    salesData.push({ date: i, sales: daySales.length })
  }

  return salesData
}
