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
      products: {
        orderBy: props.sort,
        skip: (props.page ? props.page - 1 : 0) * (props.pageSize ?? 5),
        take: props.pageSize ?? 5,
        where: { name: { contains: props.search }, status: props.status },
        include: { images: true, categories: true },
      },
    },
  })

  return store?.products
}

export async function getStoreProductsCount(
  props: Pick<BaseDataFilters, "search">
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
