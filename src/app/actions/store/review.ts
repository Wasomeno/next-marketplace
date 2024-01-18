"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import invariant from "tiny-invariant"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

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
