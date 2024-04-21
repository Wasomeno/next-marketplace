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

export async function getProductMonthlySales(productId: number, month: number) {
  const monthMoment = moment().set("month", month)

  const amountOfDays = monthMoment.daysInMonth()
  const salesData = []

  for (let i = 1; i <= amountOfDays; i++) {
    const daySales = await prisma.orderProduct.findMany({
      where: {
        product_id: productId,
        invoice: {
          created_at: {
            gte: monthMoment.set("date", i).startOf("day").toDate(),
            lte: monthMoment.set("date", i).endOf("day").toDate(),
          },
        },
      },
    })
    salesData.push({ date: i, sales: daySales.length })
  }

  return salesData
}

export async function getProductYearlySales(productId: number, year: number) {
  const time = moment().set("year", year)

  const sales = []

  for (let i = 0; i < 12; i++) {
    const daySales = await prisma.orderProduct.findMany({
      where: {
        product_id: productId,
        invoice: {
          created_at: {
            gte: time.set("month", i).startOf("month").toDate(),
            lte: time.set("month", i).endOf("month").toDate(),
          },
        },
      },
    })
    sales.push({ month: time.format("MMM"), sales: daySales.length })
  }

  return sales
}
