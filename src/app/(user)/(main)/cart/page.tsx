import { getCartItems } from "@/actions/user/cart"
import { CartItems } from "@/modules/user/cart-page/components/cart-items"
import { Prisma } from "@prisma/client"

export type CartItem = Prisma.CartItemGetPayload<{
  select: {
    amount: true
    id: true
    product: { include: { price: true; images: true } }
    product_id: true
  }
}>

export const metadata = {
  title: "Cart",
}

export default async function Cart() {
  const cart = await getCartItems()
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 px-4 lg:px-8">
        <h1 className="mb-2 text-base font-medium lg:text-xl">Cart</h1>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          {cart.count} items
        </span>
      </div>
      <CartItems items={cart.items} />
    </div>
  )
}
