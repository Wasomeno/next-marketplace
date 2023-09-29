import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request, context: any) {
  const { orderId } = context.params
  const orderDetails = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    include: {
      products: { include: { product: { include: { images: true } } } },
      status: true,
    },
  })

  return NextResponse.json(orderDetails)
}
