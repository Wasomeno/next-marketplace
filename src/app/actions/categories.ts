"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

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

type AddCategoryParams = {
  name: string
  description: string
  slug: string
  imageUrls: string[]
}

export async function addCategory({
  name,
  description,
  slug,
  imageUrls,
}: AddCategoryParams) {
  try {
    await prisma.category.create({
      data: {
        name,
        description,
        slug,
        images: {
          createMany: {
            data: imageUrls.map((imageUrl) => ({ image_url: imageUrl })),
          },
        },
      },
    })
    revalidatePath("/admin/categories")
  } catch (error) {
    throw error
  }
}

export async function updateCategory(
  id: number,
  name: string,
  description: string,
  slug: string
) {
  try {
    await prisma.category.update({
      where: { id },
      data: { name, description, slug },
    })
    revalidatePath("/")
  } catch (error) {
    throw error
  }
}

export async function deleteCategories({
  categoryIds,
}: {
  categoryIds: number[]
}) {
  try {
    await prisma.category.deleteMany({ where: { id: { in: categoryIds } } })
    revalidatePath("/admin/categories")
  } catch (error) {
    throw error
  }
}
