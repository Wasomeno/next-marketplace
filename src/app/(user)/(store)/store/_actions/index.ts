"use server"

import { Prisma, Store } from "@prisma/client"
import moment from "moment"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import {
  addDays,
  differenceInDays,
  endOfDay,
  format,
  isValid,
  startOfDay,
} from "date-fns"
import { TBaseDataFilter } from "../../../../../../types"

type GetStoreProductsParams = TBaseDataFilter & {
  storeId?: number
  slug?: string
  categoryIds?: number[]
  status?: string
}

export type StoreProduct = Prisma.ProductGetPayload<{
  include: { images: true; categories: true; reviews: true; store: true }
}>

type CreateStoreParams = Omit<Store, "id">
type UpdateStoreParams = Omit<
  Store,
  "owner_email" | "profile_image" | "created_at"
>

type GetStoreSalesParams = TBaseDataFilter

type GetStoreOrdersParams = TBaseDataFilter & {
  storeId: number
  statusIds?: Array<number>
}

export async function getStore({
  userEmail,
  slug,
  storeId,
}: {
  storeId?: number
  userEmail?: string
  slug?: string
}) {
  const store = await prisma.store.findUnique({
    where:
      !slug && !storeId
        ? { owner_email: userEmail }
        : !storeId && !userEmail
          ? { slug: slug }
          : { id: storeId },
  })

  return store
}

export async function getStoreOrders(params: GetStoreOrdersParams) {
  const orders = await prisma.order.findMany({
    orderBy: params.sort,
    where: {
      store_id: params.storeId,
      id: { contains: params.search, mode: "insensitive" },
      status_id: { in: params.statusIds },
      created_at: {
        gte: params.startDate ? new Date(params.startDate) : undefined,
        lte: params.endDate ? new Date(params.endDate) : undefined,
      },
    },
    include: {
      products: { include: { product: { include: { images: true } } } },
      _count: { select: { products: true } },
      address: true,
    },
  })

  return orders
}

export async function getStoreProducts(props: GetStoreProductsParams) {
  const store = await prisma.store.findUnique({
    where: !props.slug ? { id: props.storeId } : { slug: props.slug },
    include: {
      _count: {
        select: {
          products: {
            where: {
              name: { contains: props.search },
              status: props.status,
              categories: { some: { id: { in: props.categoryIds } } },
            },
          },
        },
      },
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

  return {
    amount: store?._count.products ?? 0,
    products: store?.products ? store.products : [],
  }
}

export async function getStoreProductsCount(
  props: Pick<TBaseDataFilter, "search"> & { storeId: number }
) {
  const productsCount = await prisma.product.count({
    where: { store_id: props.storeId, name: { contains: props.search } },
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

export async function updateStore(store: UpdateStoreParams) {
  try {
    await prisma.store.update({
      where: {
        id: store.id,
      },
      data: { ...store },
    })
  } catch (error) {
    throw error
  }

  revalidatePath("/")
}

export async function getStoreProfileImage(storeId: number) {
  const store = await getStore({ storeId })
  return store?.profile_image
}

export async function updateStoreProfileImage({
  url,
  name,
  storeId,
}: {
  url: string
  name: string
  storeId: number
}) {
  const store = await getStore({ storeId })

  await prisma.store.update({
    where: { id: store?.id },
    data: { profile_image: url },
  })
}

export async function getStoreSalesByTimeRange(
  storeId: number,
  startDate?: string,
  endDate?: string
) {
  const sales = []

  if (startDate && endDate) {
    const timeRange = differenceInDays(new Date(endDate), new Date(startDate))

    for (let i = 0; i < timeRange; i++) {
      const time = new Date(startDate)

      const timeWithAddedDays = addDays(time, i)

      if (!isValid(time)) {
        throw new Error("Invalid Date")
      }

      const store = await prisma.store.findUnique({
        where: {
          id: storeId,
        },
        select: {
          orders: {
            where: {
              created_at: {
                gte: startOfDay(timeWithAddedDays),
                lte: endOfDay(timeWithAddedDays),
              },
            },
          },
        },
      })

      if (!store?.orders) {
        throw new Error("Error Getting Store Sales")
      }

      const salesAmount = store.orders.reduce(
        (acc, order) => acc + order.total,
        0
      )

      sales.push({
        time: format(timeWithAddedDays, "dd-MM-yyyy"),
        sales: salesAmount,
      })
    }

    return sales
  }

  const defaultEarlierTime = new Date()

  defaultEarlierTime.setFullYear(defaultEarlierTime.getFullYear() - 1)

  const defaultTimeRange = differenceInDays(new Date(), defaultEarlierTime)

  for (let i = 0; i < defaultTimeRange; i++) {
    const time = defaultEarlierTime

    const timeWithAddedDays = addDays(time, i)

    if (!isValid(time)) {
      throw new Error("Invalid Date")
    }

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        orders: {
          where: {
            created_at: {
              gte: startOfDay(timeWithAddedDays),
              lte: endOfDay(timeWithAddedDays),
            },
          },
        },
      },
    })

    if (!store?.orders) {
      throw new Error("Error Getting Store Sales")
    }

    const salesAmount = store.orders.reduce(
      (acc, order) => acc + order.total,
      0
    )

    sales.push({
      time: format(timeWithAddedDays, "dd-MM-yyyy"),
      sales: salesAmount,
    })
  }

  return sales
}

export async function getStoreOrderCount(params: GetStoreOrdersParams) {
  const orders = await prisma.order.findMany({
    where: {
      store_id: params.storeId,
      created_at: {
        gte: params.startDate ? new Date(params.startDate) : undefined,
        lte: params.endDate ? new Date(params.endDate) : undefined,
      },
    },
  })

  return orders.length
}

export async function getStoreProductSoldCount(params: GetStoreOrdersParams) {
  const orders = await prisma.order.findMany({
    where: {
      store_id: params.storeId,
      created_at: {
        gte: params.startDate ? new Date(params.startDate) : undefined,
        lte: params.endDate ? new Date(params.endDate) : undefined,
      },
    },
    select: {
      products: true,
    },
  })

  return orders.reduce((acc, order) => {
    return (
      acc +
      order.products.reduce((acc, product) => {
        return acc + product.amount
      }, 0)
    )
  }, 0)
}

export async function getStoreSales(params: GetStoreSalesParams) {
  const session = await getServerSession()

  if (!session?.user.email) {
    throw new Error("User Session Invalid")
  }

  const store = await prisma.store.findUnique({
    where: {
      owner_email: session.user.email,
    },
    select: {
      orders: {
        where: {
          created_at: {
            gte: params.startDate ? new Date(params.startDate) : undefined,
            lte: params.endDate ? new Date(params.endDate) : undefined,
          },
        },
      },
    },
  })

  if (!store?.orders) {
    throw new Error("Error Getting Store Sales")
  }

  let sales = 0

  if (store.orders.length > 0) {
    sales = store?.orders
      .map((order) => order.total)
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
            orders: {
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

    sales.push({ month: time.format("MMM"), sales: store._count.orders })
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
        orders: {
          where: {
            created_at: {
              gte: time.startOf("day").toDate(),
              lte: time.endOf("day").toDate(),
            },
          },
        },
      },
    })

    if (!store?.orders) {
      throw new Error("Error Getting Store Sales")
    }

    sales.push({ date: time.format("D"), sales: store.orders.length ?? 0 })
  }

  return sales
}
