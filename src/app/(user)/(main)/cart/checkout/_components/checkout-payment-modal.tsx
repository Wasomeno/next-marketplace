"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { checkout } from "@/actions/user/order"
import { Prisma } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import Lottie from "lottie-react"
import { IconType } from "react-icons"
import { BsBank, BsCreditCard2Front } from "react-icons/bs"
import { FaCircleXmark } from "react-icons/fa6"
import { ImSpinner8 } from "react-icons/im"
import { MdMoneyOffCsred } from "react-icons/md"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import checkMarkSuccess from "@/components/lottie/files/checkmark_success.json"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from "@/components/responsive-dialog"

type PaymentMethod = {
  id: number
  name: string
  Icon: IconType
}

type PaymentStatus = "idle" | "loading" | "error" | "success"

const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Credit Card",
    Icon: BsCreditCard2Front,
  },
  {
    id: 2,
    name: "Bank Transfer",
    Icon: BsBank,
  },
  {
    id: 3,
    name: "Free",
    Icon: MdMoneyOffCsred,
  },
]

export const CheckoutPaymentModal: React.FC<{
  userEmail: string
  addressId: string
}> = ({ userEmail, addressId }) => {
  const [selectedMethod, setSelectedMethod] = useState(0)
  const [status, setStatus] = useState<PaymentStatus>("idle")

  const router = useRouter()

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isOpen = searchParams.get("payment") !== null

  const selectedCartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[] = JSON.parse(localStorage?.getItem("selectedCartItems") as string)

  const total = selectedCartItems.reduce(
    (prev, current) => (prev += current.amount * current.product.price),
    0
  )

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams)
    if (isOpen) {
      urlSearchParams.set("payment", "true")

      router.replace(`${pathname}?${urlSearchParams.toString()}`, {
        scroll: true,
      })
    } else {
      urlSearchParams.delete("payment")
      router.replace(`${pathname}?${urlSearchParams.toString()}`, {
        scroll: true,
      })
      setStatus("idle")
    }
  }

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      await checkout({
        total,
        cartItems: selectedCartItems,
        addressId,
        userEmail,
      })
    },
    onMutate: () => setStatus("loading"),
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  })

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        open={isOpen}
        className="flex flex-1 flex-col gap-4 lg:h-4/6 lg:w-2/6"
      >
        {status === "idle" && (
          <>
            <ResponsiveDialogHeader title="Payment Details" />
            <div className="flex flex-1 flex-col">
              <div className="h-full px-6">
                <h5 className="text-sm font-medium tracking-wide lg:text-base">
                  Payment Methods
                </h5>
                <div className="mt-2 flex w-full flex-col gap-2">
                  {paymentMethods.map((method) => (
                    <Button
                      variant="defaultOutline"
                      onClick={() => {
                        setSelectedMethod((current) =>
                          current === method.id ? 0 : method.id
                        )
                      }}
                      key={method.id}
                      className="flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <method.Icon className="text-slate-400" size="18" />
                        <span className="text-sm font-normal">
                          {method.name}
                        </span>
                      </div>
                      <Input
                        checked={selectedMethod === method.id}
                        type="radio"
                        className="form h-3 w-3 accent-black"
                      />
                    </Button>
                  ))}
                </div>
              </div>
              <div className="border-t p-4 dark:border-t-neutral-700">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium tracking-wide lg:text-base">
                    Total
                  </span>
                  <span className="text-sm lg:text-base">
                    Rp. {total.toLocaleString("id")}
                  </span>
                </div>
                <Button
                  disabled={!selectedMethod}
                  onClick={() => checkoutMutation.mutate()}
                  className="w-full"
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          </>
        )}
        {status === "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ImSpinner8 size="40" className="animate-spin" />
            <span className="w-3/6 text-center text-sm font-medium lg:text-base">
              Confirming Payment and Finishing Your Order
            </span>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Lottie
              animationData={checkMarkSuccess}
              loop={false}
              className="h-20 w-20 lg:h-24 lg:w-24"
            />
            <span className=" text-center text-sm font-medium lg:text-base">
              Thank You!
            </span>
            <span className=" text-center text-sm font-medium lg:text-base">
              Your payment was received successfully
            </span>
            <Button
              onClick={() => router.push("/orders")}
              variant="defaultOutline"
              className="mt-4 border border-slate-300 text-xs dark:border-gray-800"
            >
              View your orders
            </Button>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <FaCircleXmark className="h-10 w-10 text-red-600" />
            <span className="text-center text-sm font-medium lg:text-base">
              Error When Proccessing Your Payment
            </span>
            <Button
              variant="defaultOutline"
              className="mt-2 border border-slate-300 text-xs dark:border-gray-800"
              onClick={() => checkoutMutation.mutate()}
            >
              Retry
            </Button>
          </div>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
