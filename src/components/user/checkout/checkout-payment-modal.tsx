"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import { AnimatePresence } from "framer-motion"
import Lottie from "lottie-react"
import { IconType } from "react-icons"
import { BsBank, BsCreditCard2Front } from "react-icons/bs"
import { ImSpinner8 } from "react-icons/im"
import { MdMoneyOffCsred } from "react-icons/md"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import checkMarkSuccess from "@/components/lottie/files/checkmark_success.json"
import { checkout } from "@/app/actions/user/order"

type PaymentMethod = {
  id: number
  name: string
  Icon: IconType
}

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

export function CheckoutPaymentModal({ address }: { address: string }) {
  const [selectedMethod, setSelectedMethod] = useState(0)
  const [status, setStatus] = useState("idle")
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOpen = searchParams.get("payment") !== null

  const selectedCartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[] = JSON.parse(localStorage?.getItem("selectedCartItems") as string)

  const total = selectedCartItems.reduce(
    (prev, current) => (prev += current.amount * current.product.price),
    0
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => status !== "loading" && router.push("/cart/checkout")}
    >
      <AnimatePresence>
        {isOpen && (
          <DialogPortal>
            <DialogOverlay />
            <DialogContent
              open={isOpen}
              className="flex flex-1 flex-col gap-4 lg:h-4/6 lg:w-2/6"
            >
              {status === "idle" && (
                <>
                  <DialogHeader title="Payment Details" />
                  <div className="flex flex-1 flex-col">
                    <div className="h-full px-4 lg:px-6">
                      <h5 className="text-sm font-medium tracking-wide">
                        Payment Methods
                      </h5>
                      <div className="mt-2 flex w-full flex-col gap-2">
                        {paymentMethods.map((method) => (
                          <Button
                            onClick={() => {
                              setSelectedMethod((current) =>
                                current === method.id ? 0 : method.id
                              )
                            }}
                            key={method.id}
                            className="rounded-mdr flex items-center justify-between bg-gray-50 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                          >
                            <div className="flex items-center gap-4">
                              <method.Icon
                                className="text-slate-400"
                                size="18"
                              />
                              <span className="text-sm">{method.name}</span>
                            </div>
                            <Input
                              checked={selectedMethod === method.id}
                              type="radio"
                              className="form h-3 w-3"
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t p-4 dark:border-t-neutral-700">
                      <div className="mb-2">
                        <h5 className="text-sm font-medium tracking-wide">
                          Total
                        </h5>
                        <span className="text-base lg:text-lg">
                          Rp. {total.toLocaleString("id")}
                        </span>
                      </div>
                      <Button
                        variant="default"
                        disabled={!selectedMethod}
                        onClick={async () => {
                          setStatus("loading")
                          const date = new Date()
                          await checkout({
                            total,
                            cartItems: selectedCartItems,
                            address,
                          })
                          setStatus("success")
                        }}
                        className="w-full bg-blue-400 font-semibold text-white dark:bg-blue-900"
                      >
                        Confirm Payment
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {status === "loading" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <ImSpinner8
                    size="40"
                    className="animate-spin text-blue-500 dark:text-blue-800"
                  />
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
                    className="h-24 w-24"
                  />
                  <span className="text-center text-sm font-medium lg:text-base">
                    Payment & Order Confirmed
                  </span>
                  <Button
                    onClick={() => router.push("/orders")}
                    variant="defaultOutline"
                    className="mt-4 border border-slate-300 text-xs dark:border-gray-800"
                  >
                    Go to Your Orders
                  </Button>
                </div>
              )}
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
