"use server"

import { error } from "console"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

export async function getWishlist(sort: string[][]) {
  const session = await getServerSession(authOptions)
  const wishList = await prisma.wishlist.findUnique({
    where: { user_email: session?.user?.email as string },
    include: {
      items: {
        orderBy: {
          product: !sort?.length ? { price: "asc" } : Object.fromEntries(sort),
        },
        include: { product: { include: { images: true } } },
      },
    },
  })
  return wishList?.items
}

export async function isProductInWishlist(productId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user.email) {
    const wishList = await prisma.wishlist.findUnique({
      where: { user_email: session?.user?.email as string },
      select: {
        items: { include: { product: { include: { images: true } } } },
      },
    })
    const product = wishList?.items.find(
      (item) => item.product_id === productId
    )
    return product ? true : false
  } else {
    return false
  }
}

export async function addProductToWishlist(productId: number) {
  const session = await getServerSession(authOptions)
  const wishlist = await prisma.wishlist.findUnique({
    where: { user_email: session?.user?.email as string },
  })
  if (wishlist) {
    await prisma.wishlist.update({
      where: { user_email: session?.user?.email as string },
      data: {
        items: { create: { product: { connect: { id: productId } } } },
      },
    })
  }
  if (!wishlist) {
    await prisma.wishlist.create({
      data: {
        user: { connect: { email: session?.user?.email as string } },
        items: { create: { product: { connect: { id: productId } } } },
      },
    })
  }
  revalidatePath(`/${productId}`)
}

export async function removeProductFromWishlist(
  productId: number,
  path?: string
) {
  const session = await getServerSession(authOptions)
  const wishlist = await prisma.wishlist.findUnique({
    where: { user_email: session?.user?.email as string },
  })

  if (wishlist) {
    await prisma.wishlist.update({
      where: { user_email: session?.user?.email as string },
      data: { items: { deleteMany: { product_id: productId } } },
    })
  }

  if (!wishlist) {
    throw error
  }

  revalidatePath(path ?? `/${productId}`)
}

export async function removeProductsFromWishlist(
  productIds: number[],
  path?: string
) {
  const session = await getServerSession(authOptions)
  const wishlist = await prisma.wishlist.findUnique({
    where: { user_email: session?.user?.email as string },
  })

  if (wishlist) {
    const productsToDelete = productIds.map((productId) => ({
      product_id: productId,
    }))
    await prisma.wishlist.update({
      where: { user_email: session?.user?.email as string },
      data: { items: { deleteMany: productsToDelete } },
    })
  }

  if (!wishlist) {
    throw error
  }

  revalidatePath(path ?? "/wishlist")
}

export async function addAllToCart(productIds: number[]) {
  const session = await getServerSession(authOptions)
  const cart = await prisma.cart.findUnique({
    where: { user_email: session?.user?.email as string },
    include: { items: true },
  })
  if (!cart) {
    const cartItems = productIds.map((productId) => ({
      product_id: productId,
      amount: 1,
    }))
    try {
      await prisma.cart.create({
        data: {
          items: {
            createMany: {
              data: cartItems,
            },
          },
          user: { connect: { email: session?.user?.email as string } },
        },
      })
      await removeProductsFromWishlist(productIds)
    } catch (error) {
      throw error
    }
  }

  if (cart) {
    productIds.forEach(async (productId) => {
      const isItemExistInCart = cart.items.some(
        (cartItem) => cartItem.product_id === productId
      )
      const cartItem = cart?.items.find(
        (cartItem) => cartItem.product_id === productId
      )
      if (isItemExistInCart) {
        await prisma.cart.update({
          where: { user_email: session?.user?.email as string },
          data: {
            items: {
              update: {
                where: {
                  id: cartItem?.id,
                  product_id: productId,
                },
                data: { amount: (cartItem?.amount as number) + 1 },
              },
            },
          },
        })
      } else {
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              create: {
                product: { connect: { id: productId } },
                amount: 1,
              },
            },
          },
        })
      }
    })
    await removeProductsFromWishlist(productIds)
  }
}
