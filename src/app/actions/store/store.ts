"use server"

import { revalidatePath } from "next/cache"
import { Store } from "@prisma/client"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"

import { BaseDataFilters } from "../../../../types"

type GetStoreProductsProps = BaseDataFilters & {
  categoryIds?: number[]
  status?: string
}

type CreateStoreParams = Omit<Store, "id">
type UpdateStoreParams = Store

export async function getStore() {
  const session = await getServerSession()
  const store = await prisma.store.findUnique({
    where: { owner_email: session?.user.email ?? "" },
  })

  return store
}

export async function getStoreProducts(props: GetStoreProductsProps) {
  const session = await getServerSession()
  const store = await prisma.store.findUnique({
    where: { owner_email: session?.user.email ?? "" },
    include: {
      _count: { select: { products: true } },
      products: {
        orderBy: props.sort,
        skip: (props.page ? props.page - 1 : 0) * (props.pageSize ?? 5),
        take: props.pageSize ?? 5,
        where: { name: { contains: props.search }, status: props.status },
        include: { images: true, categories: true },
      },
    },
  })

  return { products: store?.products, totalAmount: store?._count.products }
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
