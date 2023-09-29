import { NextResponse } from "next/server"
import { CartItem } from "@prisma/client"

import { prisma } from "@/lib/prisma"

function generateOrderInvoice() {
  const date = new Date()
  return `INV/${date.getFullYear()}/${date.getTime()}`
}

export async function GET(context: any) {
  const { user } = context.params
  try {
    const orders = await prisma.order.findMany({
      where: { user: { email: { contains: user } } },
      include: {
        products: { include: { product: { include: { images: true } } } },
        status: true,
      },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.error()
  }
}

export async function POST(request: Request, context: any) {
  const { user } = context.params
  const { cartItems, total } = await request.json()
  try {
    await prisma.order
      .create({
        data: {
          invoice: generateOrderInvoice(),
          user,
          products: {
            connect: cartItems.map((cartItem: CartItem) => ({
              id: cartItem.product_id,
            })),
          },
          total: parseInt(total),
          status: { connect: { id: 1 } },
        },
      })
      .then(
        async () =>
          await prisma.cartItem.deleteMany({
            where: {
              id: {
                in: cartItems.map((cartItem: CartItem) => cartItem.id),
              },
            },
          })
      )
    return NextResponse.json({ message: "Successfully made an order" })
  } catch (error) {
    return NextResponse.error()
  }
}
