"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getProducts(): Promise<
  Prisma.ProductGetPayload<{ include: { images: true; category: true } }>[]
> {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
  })
  return products
}

export async function getProduct(
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

type UpdateProductParams = {
  productId: number
  name: string
  stock: number
  description: string
  price: number
  categoryId: number
}

export async function updateProduct({
  productId,
  name,
  stock,
  description,
  price,
  categoryId,
}: UpdateProductParams) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: name,
        stock: stock,
        price: price,
        description: description,
        category: { connect: { id: categoryId } },
      },
    })
    revalidatePath("/")
  } catch (error) {
    throw error
  }
}
