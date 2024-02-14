"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import invariant from "tiny-invariant"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

import { BaseDataFilters } from "../../../../types"
import { getStore } from "./store"

type GetStoreProductReviewsProps = BaseDataFilters

export async function getStoreProductReviews(
  props?: GetStoreProductReviewsProps
) {
  const store = await getStore()

  const reviews = await prisma.productReview.findMany({
    orderBy: props?.sort,
    skip: (props?.page ? props.page - 1 : 0) * (props?.pageSize ?? 5),
    take: props?.pageSize ?? 5,
    where: {
      product: { store_id: store?.id, name: { contains: props?.search } },
    },
    include: { product: true, user: true },
  })

  return reviews
}

export async function getStoreProductReviewsCount(
  props: Pick<BaseDataFilters, "search">
) {
  const store = await getStore()

  const reviewsCount = await prisma.productReview.count({
    where: {
      product: { store_id: store?.id, name: { contains: props?.search } },
    },
  })

  return reviewsCount
}

async function changeOrderProductReviewStatus(orderProductId: number) {
  try {
    await prisma.orderProduct.update({
      where: { id: orderProductId },
      data: {
        isReviewed: true,
      },
    })
  } catch (error) {
    throw error
  }
}

async function addProductReview({
  productId,
  rating,
  review,
  userEmail,
}: {
  productId: number
  rating: number
  review: string
  userEmail: string
}) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        reviews: {
          create: {
            rating,
            review,
            user: { connect: { email: userEmail } },
          },
        },
      },
    })
  } catch (error) {
    throw error
  }
}

export async function addReview({
  orderProductId,
  productId,
  rating,
  review,
}: {
  orderProductId: number
  productId: number
  rating: number
  review: string
}) {
  const session = await getServerSession(authOptions)

  invariant(session)

  await Promise.all([
    addProductReview({
      productId,
      rating,
      review,
      userEmail: session.user.email as string,
    }),
    changeOrderProductReviewStatus(orderProductId),
  ])

  revalidatePath("/orders")
}
