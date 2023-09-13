"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

type CheckoutProps = {
  cartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[]
  total: number
  invoice: string
}

export async function checkout({ cartItems, total, invoice }: CheckoutProps) {
  const session = await getServerSession(authOptions)
  try {
    await prisma.order
      .create({
        data: {
          invoice,
          user: session?.user?.email as string,
          products: {
            connect: cartItems.map((cartItem) => ({
              id: cartItem.product_id,
            })),
          },
          total: total,
          status: { connect: { id: 3 } },
        },
      })
      .then(
        async () =>
          await prisma.cartItem.deleteMany({
            where: {
              id: {
                in: cartItems.map((cartItem) => cartItem.id),
              },
            },
          })
      )
  } catch (error) {
    throw error
  }
  revalidatePath("/")
}
