"use client"

import { addToCart } from "@/actions/user/cart"
import { Product } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

type AddToCartFormProps = {
  product: Product
}

export const AddToCartForm = ({ product }: AddToCartFormProps) => {
  const [amount, setAmount] = useState<number>(1)
  const router = useRouter()

  const { status: sessionStatus } = useSession()

  function increment() {
    if (amount >= 5) return
    setAmount((currentAmount) => currentAmount + 1)
  }

  function decrement() {
    if (amount <= 1) return
    setAmount((currentAmount) => currentAmount - 1)
  }

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(product.id, amount),
    onSuccess: () => toast.success(`Added ${product.name} to your cart`),
    onError: () =>
      toast.success(`Error when adding ${product.name} to your cart`),
  })

  return (
    <div className="sticky bottom-0 m-0 h-fit w-full lg:space-y-4 lg:mb-6 border-t border-slate-200 bg-white p-2 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:rounded-lg lg:border lg:border-slate-200 lg:p-4 lg:shadow-sm lg:dark:border-gray-800">
      <span className="hidden lg:inline-block">Add to Cart</span>
      <div className="lg:space-y-3">
        <div className="hidden lg:block">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 lg:text-sm">Quantity</span>
            <div className="relative flex w-fit items-center justify-center gap-4 overflow-hidden rounded-md border border-gray-200 text-sm font-medium dark:bg-slate-800">
              <button
                onClick={decrement}
                className="border-r border-gray-200 bg-gray-50 lg:h-6 lg:w-6"
              >
                -
              </button>
              <div className="w-4 text-center">
                <span>{amount}</span>
              </div>
              <button
                onClick={increment}
                className="border-l border-gray-200 bg-gray-50 lg:h-6 lg:w-6"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="hidden items-center justify-between lg:flex">
          <span className="text-xs text-slate-500 lg:text-sm">Subtotal</span>
          <span className="text-sm lg:text-base">
            Rp. {(amount * product.price).toLocaleString("id")}
          </span>
        </div>
        <div className="flex w-full gap-2 lg:flex-col lg:gap-0">
          <Button
            variant="default"
            disabled={addToCartMutation.isPending}
            className="w-full"
            onClick={() =>
              sessionStatus === "unauthenticated"
                ? router.push("/login")
                : addToCartMutation.mutate()
            }
          >
            {addToCartMutation.isPending && (
              <ImSpinner8 className="animate-spin" />
            )}
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
