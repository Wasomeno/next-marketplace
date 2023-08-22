"use server"

import { Category, Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getAllCategories(): Promise<
  Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } }; images: true }
  }>[]
> {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } }, images: true },
  })
  return categories
}

export async function getCategoryDetails(
  categoryId: number
): Promise<Prisma.CategoryGetPayload<{
  include: { images: true; products: true }
}> | null> {
  const productDetails = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { images: true, products: true },
  })
  return productDetails
}
