import { getCartItems } from "@/actions/user/cart"
import { Button } from "@/components/ui/button"

import { ArrowRight, PackageOpen } from "lucide-react"
import { CartItems } from "./_components/cart-items"

export const metadata = {
  title: "Cart",
}

export default async function Cart() {
  const cart = await getCartItems()
  return (
    <div className="flex flex-col w-full flex-1 bg-white">
      {cart.items.length > 0 ? <CartItems items={cart.items} /> : <EmptyCart />}
    </div>
  )
}

const EmptyCart = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col flex-1 justify-center items-center">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 flex items-center justify-center">
          <PackageOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8 max-w-[30rem]">
          Looks like you haven't added anything to your cart yet. Explore our
          products and find something you'll love.
        </p>
        <div className="flex items-center justify-center">
          <Button variant="default" size="lg">
            Start Shopping
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}
