"use server"

import moment from "moment";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { Prisma, Store } from "@prisma/client";

import { TBaseDataFilter } from "../../../types";

type GetStoreProductsProps = TBaseDataFilter & {
  userEmail?: string
  slug?: string
  categoryIds?: number[]
  status?: string
}

export type StoreProduct = Prisma.ProductGetPayload<{
  include: { images: true; categories: true; reviews: true; store: true }
}>

type CreateStoreParams = Omit<Store, "id">
type UpdateStoreParams = Store

export async function getStore(slug?: string) {
  const session = await getServerSession()
  const store = await prisma.store.findUnique({
    where: !slug ? { owner_email: session?.user.email ?? "" } : { slug: slug },
  })

  return store
}

export async function getStoreProducts(
  props: GetStoreProductsProps
): Promise<StoreProduct[]> {
  const store = await prisma.store.findUnique({
    where: !props.slug
      ? { owner_email: props.userEmail }
      : { slug: props.slug },
    include: {
      products: {
        orderBy: props?.sort,
        skip:
          (props.page ? Number(props.page) - 1 : 0) *
          (Number(props.pageSize) ?? 5),
        take: Number(props.pageSize) ?? 5,
        where: {
          name: { contains: props.search },
          status: props.status,
          categories: { some: { id: { in: props.categoryIds } } },
        },
        include: { images: true, categories: true, reviews: true, store: true },
      },
    },
  })

  return store?.products ? store.products : []
}

export async function getStoreProductsCount(
  props: Pick<TBaseDataFilter, "search">
) {
  const store = await getStore()
  const productsCount = await prisma.product.count({
    where: { store_id: store?.id, name: { contains: props.search } },
  })

  return productsCount
}

export async function createStore(store: CreateStoreParams) {
  try {
    await prisma.store.create({
      data: { ...store },
    })
  } catch (error) {
    throw error
  }

  revalidatePath("/")
}

export async function getStoreProfileImage() {
  const store = await getStore()
  return store?.profile_image
}

export async function updateStoreProfileImage(url: string, name: string) {
  const store = await getStore()

  await prisma.store.update({
    where: { id: store?.id },
    data: { profile_image: url },
  })
}

export async function getStoreTransactionCount() {
  const session = await getServerSession()

  if (!session?.user.email) {
    throw new Error("User Session Invalid")
  }

  const store = await prisma.store.findUnique({
    where: {
      owner_email: session.user.email,
    },
    select: { _count: { select: { invoices: true } } },
  })

  return store?._count.invoices ?? 0
}

export async function getStoreSales() {
  const session = await getServerSession()

  if (!session?.user.email) {
    throw new Error("User Session Invalid")
  }

  const store = await prisma.store.findUnique({
    where: {
      owner_email: session.user.email,
    },
    select: { invoices: { include: { order: true } } },
  })

  if (!store?.invoices) {
    throw new Error("Error Getting Store Sales")
  }

  let sales = 0

  if (store.invoices.length > 0) {
    sales = store?.invoices
      .map((invoice) => invoice.order.total)
      .reduce((accumulator, orderTotal) => accumulator + orderTotal, 0)
  }

  return sales
}

export async function getStoreYearlySales(year: number) {
  const session = await getServerSession()

  if (!session?.user.email) {
    throw new Error("User Session Invalid")
  }

  const sales = []

  for (let i = 0; i < 12; i++) {
    const time = moment().set("year", year).set("month", i)

    const store = await prisma.store.findUnique({
      where: {
        owner_email: session.user.email,
      },
      select: {
        _count: {
          select: {
            invoices: {
              where: {
                created_at: {
                  gte: time.startOf("month").toDate(),
                  lte: time.endOf("month").toDate(),
                },
              },
            },
          },
        },
      },
    })

    if (!store?._count) {
      throw new Error("Error Getting Store Sales")
    }

    sales.push({ month: time.format("MMM"), sales: store._count.invoices })
  }

  return sales
}

export async function getStoreMonthlySales(month: number) {
  const session = await getServerSession()

  if (!session?.user.email) {
    throw new Error("User Session Invalid")
  }

  const sales = []

  const monthTime = moment().set("month", month)

  const daysInMonth = monthTime.daysInMonth()

  for (let i = 1; i <= daysInMonth; i++) {
    const time = monthTime.set("date", i)

    const store = await prisma.store.findUnique({
      where: {
        owner_email: session.user.email,
      },
      select: {
        invoices: {
          where: {
            created_at: {
              gte: time.startOf("day").toDate(),
              lte: time.endOf("day").toDate(),
            },
          },
          include: { order: true },
        },
      },
    })

    if (!store?.invoices) {
      throw new Error("Error Getting Store Sales")
    }

    sales.push({ date: time.format("D"), sales: store.invoices.length ?? 0 })
  }

  return sales
}
