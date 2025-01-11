"use client"

import { Button } from "@/components/ui/button"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { CartItem } from "../_types"

interface CartCheckoutDialogProps {
  selectedItems: CartItem[]
}

export const CartSummary = ({ selectedItems }: CartCheckoutDialogProps) => {
  const router = useRouter()
  const subTotal = selectedItems.reduce(
    (firstValue, item) => item.amount * item.product.price + firstValue,
    0
  )
  const taxFromSubTotal = subTotal * 0.11
  const total = subTotal + taxFromSubTotal

  function currencyFormat(value: number) {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
  }

  function onCheckout() {
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems))
    router.push("/checkout")
  }

  return (
    <div className="lg:sticky lg:top-28">
      <div className="shadow-2xl shadow-gray-100/50 rounded-2xl border overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 p-4">
          <div className="text-xl">Order Summary</div>
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{currencyFormat(subTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{currencyFormat(0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (11%)</span>
              <span>{currencyFormat(taxFromSubTotal)}</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{currencyFormat(total)}</span>
            </div>
          </div>
          <Button
            variant="default"
            size="lg"
            className="w-full"
            disabled={selectedItems.length === 0}
            onClick={onCheckout}
          >
            Checkout
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-sm text-gray-500">
            Free shipping on orders over Rp 1,000,000
          </p>
        </div>
      </div>
    </div>
  )
}
