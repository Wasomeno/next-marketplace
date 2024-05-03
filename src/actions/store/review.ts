"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

import { TBaseDataFilter } from "../../../types"

type GetStoreProductReviewsProps = TBaseDataFilter & {
  storeId: number
}

export async function getStoreProductReviews(
  params: GetStoreProductReviewsProps
) {
  const page = Number(params?.page)
  const pageSize = Number(params?.pageSize)

  const reviews = await prisma.productReview.findMany({
    orderBy: params?.sort,
    skip: (params?.page ? page - 1 : 0) * (pageSize ?? 5),
    take: pageSize ?? 5,
    where: {
      product: { store_id: params.storeId, name: { contains: params?.search } },
    },
    include: { product: true, user: true },
  })

  return reviews
}

export async function getStoreProductReviewsCount(
  params: Pick<TBaseDataFilter, "search"> & { storeId: number }
) {
  const reviewsCount = await prisma.productReview.count({
    where: {
      product: { store_id: params.storeId, name: { contains: params?.search } },
    },
  })

  return reviewsCount
}

export async function createProductReview({
  orderProductId,
  productId,
  rating,
  review,
  userEmail,
  title,
}: {
  title: string
  orderProductId: number
  productId: number
  rating: number
  review: string
  userEmail: string
}) {
  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        reviews: {
          create: {
            rating,
            title,
            review,
            user: { connect: { email: userEmail } },
          },
        },
      },
    })

    await prisma.orderProduct.update({
      where: { id: orderProductId },
      data: { isReviewed: true },
    })

    revalidatePath("/orders")
  } catch (error) {
    throw error
  }
}
