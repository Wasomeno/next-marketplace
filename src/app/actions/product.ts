"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type GetProductsProps = {
  categoryIds?: number[]
  storeId?: number
}

export async function getProducts(
  props: GetProductsProps
): Promise<
  Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>[]
> {
  const products = await prisma.product.findMany({
    where: {
      categories: { some: { id: { in: props.categoryIds } } },
      store_id: props.storeId,
    },
    include: { images: true, categories: true },
  })
  return products
}

export async function getProduct(
  productId: number
): Promise<Prisma.ProductGetPayload<{
  include: { images: true; categories: true; store: true }
}> | null> {
  const productDetails = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, categories: true, store: true },
  })
  return productDetails
}
