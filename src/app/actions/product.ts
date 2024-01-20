"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type GetProductsProps = {
  categorySlug?: string
  categoryIds?: number[]
  storeId?: number
  priceStart?: number
  priceEnd?: number
  sort?: Record<string, "desc" | "asc">
}

export async function getProducts({
  categorySlug,
  categoryIds,
  storeId,
  priceEnd,
  priceStart,
  sort,
}: GetProductsProps): Promise<
  Prisma.ProductGetPayload<{
    include: { images: true; categories: true; store: true; reviews: true }
  }>[]
> {
  const products = await prisma.product.findMany({
    orderBy: sort,
    where: {
      categories: { every: { slug: categorySlug } },
      store_id: storeId,
      price: { gte: priceStart, lte: priceEnd },
    },
    include: { images: true, categories: true, store: true, reviews: true },
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
