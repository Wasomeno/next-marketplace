"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

export async function addReview({
  id,
  rating,
  review,
}: {
  id: number
  rating: number
  review: string
}) {
  const session = await getServerSession(authOptions)
  try {
    await prisma.product.update({
      where: { id },
      data: {
        reviews: {
          create: {
            rating,
            review,
            user: { connect: { email: session?.user.email as string } },
          },
        },
      },
    })
  } catch (error) {
    throw error
  }
}
