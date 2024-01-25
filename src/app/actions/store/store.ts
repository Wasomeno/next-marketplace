"use server"

import { revalidatePath } from "next/cache"
import { Store } from "@prisma/client"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"

type GetStoreProductsProps = {
  search?: string
  categoryIds?: number[]
  sort?: Record<string, "desc" | "asc">
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
    select: {
      products: {
        orderBy: props.sort,
        where: { name: { contains: props.search }, status: props.status },
        include: { images: true, categories: true },
      },
    },
  })

  return store?.products ?? []
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
