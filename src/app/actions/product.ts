"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type GetProductsProps = {
  q?: string
  categorySlug?: string
  categoryIds?: number[]
  storeId?: number
  priceStart?: number
  priceEnd?: number
  sort?: Record<string, "desc" | "asc">
}

export async function getProducts({
  q,
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
      name: { contains: q },
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
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, categories: true, store: true },
  })
  return product
}

export async function getProductReviews(productId: number) {
  const reviews = await prisma.productReview.findMany({
    where: { product_id: productId },
    include: { user: true },
  })

  return reviews
}
