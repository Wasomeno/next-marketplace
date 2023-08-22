"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getAllProducts(): Promise<
  Prisma.ProductGetPayload<{ include: { images: true; category: true } }>[]
> {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
  })
  return products
}

export async function getProductDetails(
  productId: number
): Promise<Prisma.ProductGetPayload<{
  include: { images: true; category: true }
}> | null> {
  const productDetails = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, category: true },
  })
  return productDetails
}
