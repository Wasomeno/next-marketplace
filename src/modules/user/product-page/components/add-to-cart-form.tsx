"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/actions/user/cart"
import { Product } from "@prisma/client"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"

type AddToCartFormProps = {
  product: Product
}

export const AddToCartForm = ({ product }: AddToCartFormProps) => {
  const [amount, setAmount] = useState<number>(1)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { data: session } = useSession()
  const userEmail = session?.user?.email

  function increment() {
    if (amount >= 5) return
    setAmount((currentAmount) => currentAmount + 1)
  }

  function decrement() {
    if (amount <= 1) return
    setAmount((currentAmount) => currentAmount - 1)
  }

  return (
    <div className="sticky bottom-0 m-0 h-fit w-screen border-t border-slate-200 bg-white p-2 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:top-20 lg:mr-20 lg:w-80 lg:rounded-lg lg:border lg:border-slate-200 lg:p-4 lg:shadow-sm lg:dark:border-gray-800">
      <span className="hidden lg:inline-block">Add to Cart Details</span>
      <div className="hidden lg:block">
        <div className="my-4 flex items-center justify-between gap-4">
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
      <div className="my-2 hidden items-center justify-between lg:flex">
        <span className="text-xs text-slate-500 lg:text-sm">Subtotal</span>
        <span className="text-sm lg:text-base">
          Rp. {(amount * product.price).toLocaleString("id")}
        </span>
      </div>
      <div className="flex w-full gap-2 lg:flex-col lg:gap-0">
        <Button
          variant="default"
          onClick={() =>
            userEmail
              ? startTransition(async () => {
                  await addToCart(product.id, amount)
                  toast.success("Added to cart")
                })
              : router.push("/login")
          }
          className="my my-2 h-8 w-full rounded-lg  bg-blue-400 text-xs font-medium text-slate-50 hover:bg-blue-500 dark:bg-blue-900 lg:h-10 lg:text-sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
