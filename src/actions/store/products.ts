"use server"

import { revalidatePath } from "next/cache"
import { Product } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { getProduct } from "../product"
import { getUserStore } from "../user/user-details"

type UpdateProductParams = Omit<
  Product,
  "status" | "store_id" | "sold" | "slug"
> & {
  storeId: number
  status: "draft" | "published"
  images: { name: string; url: string }[]
  categoryIds: number[]
}

type AddProductProps = Omit<
  Product,
  "status" | "id" | "store_id" | "sold" | "slug"
> & {
  storeId: number
  status: "draft" | "published"
  images: { name: string; url: string }[]
  categoryIds: number[]
}

export async function addProduct({
  categoryIds,
  images,
  storeId,
  ...product
}: AddProductProps) {
  try {
    await prisma.product.create({
      data: {
        ...product,
        slug: generateSlug(product.name),
        store_id: storeId,
        images: { createMany: { data: images } },
        categories: { connect: categoryIds.map((id) => ({ id: id })) },
      },
    })
    revalidatePath("/")
  } catch (error) {
    throw Error("Error When Adding New Product")
  }
}

export async function updateProduct({
  storeId,
  ...product
}: UpdateProductParams) {
  const currentProduct = await getProduct(product.id)
  try {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        slug: generateSlug(product.name),
        featured_image_url: product.featured_image_url,
        store_id: storeId,
        categories: {
          connect: product.categoryIds.map((id) => ({ id: id })),
          disconnect: currentProduct?.categories.filter(
            (category) => !product.categoryIds.includes(category.id)
          ),
        },
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

function generateSlug(name: string) {
  return name.toLowerCase().replaceAll(" ", "-")
}
