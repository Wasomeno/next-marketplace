"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { TBaseDataFilter } from "../../../types"

export type TOrderStatus =
  | "Payment Confirmed"
  | "On Shipping"
  | "On Proccess"
  | "Arrived"
  | "Done"

type TCheckout = {
  userEmail: string
  cartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[]
  total: number
  addressId: string
}

type GetStoreOrdersParams = TBaseDataFilter & {
  storeId: number
}
type GetUserOrdersParams = TBaseDataFilter & {
  status?: string
  userEmail: string
}

type GetOrderParams = TBaseDataFilter & {
  status?: string
  orderId: string
}

export async function getStoreOrders(params: GetStoreOrdersParams) {
  const orders = await prisma.order.findMany({
    where: { store_id: params.storeId },
    include: {
      products: { include: { product: { include: { images: true } } } },
      _count: { select: { products: true } },
      address: true,
    },
  })

  return orders
}

export async function getUserOrders(params: GetUserOrdersParams) {
  const orders = await prisma.order.findMany({
    where: { user_email: params.userEmail, status: params.status },
    include: { products: { include: { product: true } } },
  })

  return orders
}

export async function getOrder(params: GetOrderParams) {
  const orders = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      products: { include: { product: { include: { images: true } } } },
      address: true,
    },
  })

  return orders
}

export async function getStoreOrderCount(params: GetStoreOrdersParams) {
  const orders = await prisma.order.findMany({
    where: { store_id: params.storeId },
  })

  return orders.length
}

export async function checkout({ userEmail, cartItems, addressId }: TCheckout) {
  const itemStoreIds = new Set(cartItems.map((item) => item.product.store_id))

  try {
    for (const storeId of itemStoreIds.values()) {
      const itemsBasedOnStoreId = cartItems.filter(
        (item) => item.product.store_id === storeId
      )

      const total = itemsBasedOnStoreId.reduce(
        (accumulator, currentItem) =>
          (accumulator += currentItem.amount * currentItem.product.price),
        0
      )

      await prisma.order.create({
        data: {
          total,
          products: {
            createMany: {
              data: itemsBasedOnStoreId.map((item) => ({
                amount: item.amount,
                product_id: item.product_id,
                total: item.amount * item.product.price,
              })),
            },
          },
          address_id: addressId,
          store_id: storeId,
          user_email: userEmail,
        },
      })
    }

    await prisma.cart.delete({
      where: {
        user_email: userEmail,
      },
    })
  } catch (error) {
    throw error
  }
  revalidatePath("/")
}

export async function changeOrderStatus({
  status,
  orderId,
}: {
  status: TOrderStatus
  orderId: string
}) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
  } catch (error) {
    throw error
  }
}
