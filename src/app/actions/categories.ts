import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getCategories(): Promise<
  Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } }; images: true }
  }>[]
> {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } }, images: true },
  })
  return categories
}

export async function getCategory(
  categoryId: number
): Promise<Prisma.CategoryGetPayload<{
  include: { images: true }
}> | null> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { images: true },
  })

  return category
}
