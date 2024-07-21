import { Prisma } from "@prisma/client"

export type CheckoutItem = Prisma.CartItemGetPayload<{
  include: { product: { include: { images: true } } }
}>
