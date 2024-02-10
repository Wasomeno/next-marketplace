"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type GetCategoriesProps = {
  search?: string
  sort?: Record<string, "desc" | "asc">
}

export async function getCategories(props?: GetCategoriesProps): Promise<
  Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } }; images: true }
  }>[]
> {
  const categories = await prisma.category.findMany({
    orderBy: props?.sort,
    where: { name: { contains: props?.search } },
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
