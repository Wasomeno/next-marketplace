"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

import { TBaseDataFilter } from "../../types"

type GetCategoriesProps = TBaseDataFilter

type AddCategoryParams = {
  name: string
  description: string
  slug: string

  image: { name: string; url: string }
}

type UpdateCategoryParams = {
  id: number
  name: string
  description: string
  slug: string
  image: { name: string; url: string }
}

export async function addCategory({
  name,
  description,
  slug,
  image,
}: AddCategoryParams) {
  try {
    await prisma.category.create({
      data: {
        name,
        description,
        slug,
        image: {
          create: image,
        },
      },
    })
  } catch (error) {
    throw error
  }
}

export async function updateCategory({
  id,
  name,
  description,
  slug,
  image,
}: UpdateCategoryParams) {
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        image: {
          update: {
            data: {
              name: image.name,
              url: image.url,
            },
          },
        },
      },
    })
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

export async function getCategories(props?: GetCategoriesProps) {
  const categories = await prisma.category.findMany({
    orderBy: props?.sort,
    where: { name: { contains: props?.search, mode: "insensitive" } },
    include: { _count: { select: { products: true } }, image: true },
  })

  return categories
}

export async function getCategory(categoryId: number) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { image: true },
  })

  return category
}
