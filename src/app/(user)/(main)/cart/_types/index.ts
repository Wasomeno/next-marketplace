import { Prisma } from "@prisma/client"

export type CartItem = Prisma.CartItemGetPayload<{
  select: {
    amount: true
    id: true
    product: { include: { price: true; images: true } }
    product_id: true
  }
}>
