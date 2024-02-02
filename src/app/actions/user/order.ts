"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"

export type TOrderStatus =
  | "Payment Confirmed"
  | "On Shipping"
  | "On Proccess"
  | "Arrived"
  | "Done"

type TCheckout = {
  cartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[]
  total: number
  address: string
}

export async function checkout({ cartItems, address }: TCheckout) {
  const session = await getServerSession()

  const storeIds = cartItems.reduce(
    (currentIds, item) =>
      currentIds.includes(item.product.store_id)
        ? currentIds
        : [...currentIds, item.product.store_id],
    [] as number[]
  )

  const productsBasedOnStore: Record<string, typeof cartItems> =
    storeIds.reduce(
      (currentProducts, storeId) => ({
        ...currentProducts,
        [storeId]: cartItems.filter(
          (cartItem) => cartItem.product.store_id === storeId
        ),
      }),
      {}
    )

  try {
    const date = new Date()

    await prisma.order.create({
      data: {
        total: cartItems.reduce(
          (total, cartItem) => total + cartItem.amount * cartItem.product.price,
          0
        ),
        user_email: session?.user.email as string,
        invoices: {
          create: storeIds.map((storeId) => ({
            id: `INV/${date.getFullYear()}/${date.getTime()}/${storeId}`,
            store: { connect: { id: storeId } },
            products: {
              createMany: {
                data: productsBasedOnStore[storeId].map((product) => ({
                  product_id: product.product_id,
                  total: product.product.price * product.amount,
                  amount: product.amount,
                })),
              },
            },
            address,
            created_at: new Date(),
            status: "Payment Confirmed",
            total: productsBasedOnStore[storeId].reduce(
              (total, orderProduct) =>
                total + orderProduct.amount * orderProduct.product.price,
              0
            ),
          })),
        },
      },
    })

    await prisma.cartItem.deleteMany({
      where: {
        id: {
          in: cartItems.map((cartItem) => cartItem.id),
        },
      },
    })
  } catch (error) {
    throw error
  }
  revalidatePath("/")
}
