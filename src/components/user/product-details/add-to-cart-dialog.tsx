"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Product } from "@prisma/client"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { addToCart } from "@/app/actions/cart"

type AddToCartDialogProps = {
  productDetails: Product
}

export const AddToCartDialog = ({ productDetails }: AddToCartDialogProps) => {
  const [amount, setAmount] = useState<number>(1)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { data: session } = useSession()
  const userEmail = session?.user?.email

  function increment() {
    if (amount >= productDetails.stock) return
    setAmount((currentAmount) => currentAmount + 1)
  }

  function decrement() {
    if (amount <= 1) return
    setAmount((currentAmount) => currentAmount - 1)
  }

  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-3/12">
      <div className="border-t border-slate-200 p-2 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:rounded-md lg:border lg:border-slate-400 lg:p-4 lg:shadow-none lg:dark:border-gray-800">
        <div className="hidden lg:block">
          <span className="text-sm lg:text-base">Product Amount</span>
          <div className="my-4 flex items-center justify-center gap-4">
            <div className="relative flex w-3/6 items-center justify-center gap-4 rounded-md bg-slate-200 text-sm font-medium dark:bg-slate-800">
              <button onClick={decrement} className="h-6 w-6 lg:h-8 lg:w-8">
                -
              </button>
              <span>{amount}</span>
              <button onClick={increment} className="h-6 w-6 lg:h-8 lg:w-8">
                +
              </button>
            </div>
            <span className="w-3/6 text-end text-xs lg:text-sm">
              Stock: {productDetails.stock}
            </span>
          </div>
        </div>
        <div className="my-2 hidden justify-between lg:flex">
          <span className="text-xs text-slate-500 lg:text-base">Subtotal</span>
          <span className="text-sm lg:text-lg">
            Rp. {(amount * productDetails.price).toLocaleString("id")}
          </span>
        </div>
        <div className="flex w-full gap-2 lg:flex-col lg:gap-0">
          <Button
            variant="default"
            onClick={() =>
              userEmail
                ? startTransition(async () => {
                    await addToCart(productDetails.id, amount)
                    toast.success("Added to cart")
                  })
                : router.push("/login")
            }
            className="my my-2 h-8 w-full rounded-lg  bg-blue-400 text-xs font-medium text-slate-50 dark:bg-blue-900 lg:h-10 lg:text-sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
