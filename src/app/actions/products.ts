"use server"

import { revalidatePath } from "next/cache"
import { Prisma, Product } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { getUserStore } from "./user-details"

export async function getProducts(): Promise<
  Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>[]
> {
  const products = await prisma.product.findMany({
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

type UpdateProductParams = Omit<Product, "status" | "store_id"> & {
  status: "draft" | "published"
  images: { name: string; url: string }[]
  categoryIds: number[]
}

type AddProductProps = Omit<Product, "status" | "id" | "store_id"> & {
  status: "draft" | "published"
  images: { name: string; url: string }[]
  categoryIds: number[]
}

export async function addProduct({
  categoryIds,
  images,
  ...product
}: AddProductProps) {
  const userStore = await getUserStore()
  try {
    await prisma.product.create({
      data: {
        ...product,
        store_id: userStore?.id as number,
        images: { createMany: { data: images } },
        categories: { connect: categoryIds.map((id) => ({ id: id })) },
      },
    })
    revalidatePath("/")
  } catch (error) {
    throw error
  }
}

export async function updateProduct(product: UpdateProductParams) {
  const userStore = await getUserStore()
  try {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        slug: product.slug,
        featured_image_url: product.featured_image_url,
        store_id: userStore?.id,
        categories: { connect: product.categoryIds.map((id) => ({ id: id })) },
        images: {
          deleteMany: {},
        },
      },
    })

    const imagesResult = await prisma.$transaction(
      product.images.map((image) =>
        prisma.productImage.create({
          data: {
            name: image.name,
            url: image.url,
            product: { connect: { id: product.id } },
          },
        })
      )
    )

    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: {
          connect: imagesResult.map((image) => ({ id: image.id })),
        },
      },
    })
    revalidatePath("/")
  } catch (error) {
    throw error
  }
}

export async function deleteProduct(productIds: number[]) {
  try {
    await prisma.product.deleteMany({
      where: { id: { in: productIds } },
    })
    revalidatePath("/")
  } catch (error) {
    throw error
  }
}
