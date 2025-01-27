"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

import { TBaseDataFilter } from "../../../types"

type TCheckout = {
  userEmail: string
  cartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[]
  total: number
  addressId: string
}

type GetUserOrdersParams = TBaseDataFilter & {
  statusId?: number
  userEmail: string
}

type GetOrderParams = TBaseDataFilter & {
  status?: string
  orderId: string
}

export async function getUserOrders(params: GetUserOrdersParams) {
  const orders = await prisma.order.findMany({
    where: { user_email: params.userEmail, status_id: params.statusId },
    include: { products: { include: { product: true } }, status: true },
  })

  return orders
}

export async function getOrderStatuses() {
  const statuses = (await prisma.orderStatus.findMany()).toSorted((a, b) =>
    a.id > b.id ? 1 : -1
  )
  return statuses
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
          status_id: 1,
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
  statusId,
  orderId,
}: {
  statusId: number
  orderId: string
}) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status_id: statusId + 1,
      },
    })
  } catch (error) {
    throw error
  }
}
