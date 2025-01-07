import { getCartItems } from "@/actions/user/cart"

import { CartItems } from "./_components/cart-items"

export const metadata = {
  title: "Cart",
}

export default async function Cart() {
  const cart = await getCartItems()
  return (
    <div className="flex flex-1 flex-col lg:px-28">
      <div className="mb-4">
        <h1 className="text-base font-medium lg:text-xl">Cart</h1>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          {cart.count} items
        </span>
      </div>
      <CartItems items={cart.items} />
    </div>
  )
}
