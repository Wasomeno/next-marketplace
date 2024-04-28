"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { getUserInvoice } from "@/actions/user/invoice"
import { Prisma } from "@prisma/client"
import { Separator } from "@radix-ui/react-separator"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { ImSpinner8 } from "react-icons/im"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"

export function UserViewOrderModal() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const invoiceId = searchParams.get("invoice")

  const isOpen = invoiceId !== null

  const invoice = useQuery<Prisma.InvoiceGetPayload<{
    include: {
      products: { include: { product: { include: { images: true } } } }
      _count: { select: { products: true } }
    }
  }> | null>({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => await getUserInvoice(invoiceId as string),
  })

  const date = new Date(invoice.data?.created_at as Date)

  function closeModal() {
    const searchParamsValues = new URLSearchParams(searchParams.toString())
    searchParamsValues.delete("invoice")
    router.replace(`/orders?${searchParamsValues.toString()}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          open={isOpen}
          className="flex w-full flex-1 flex-col gap-4 lg:h-4/6 lg:w-3/6"
        >
          <DialogHeader title="Order Details" />
          {invoice.isLoading ? (
            <div className="flex h-full items-center justify-center">
              <ImSpinner8 size={30} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="flex h-full flex-1 flex-col justify-between px-4 pb-4 pt-2 lg:px-6">
              <div className="flex flex-1 flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h2 className=" text-sm text-gray-500 lg:text-base">
                      Invoice Id:{" "}
                      <span className="font-medium text-black">
                        {invoice.data?.id}
                      </span>
                    </h2>
                    <span className="text-sm">{invoice.data?.status}</span>
                  </div>
                  <div className="">
                    <h3 className="text-xs text-gray-500 lg:text-sm">
                      Ordered at:{" "}
                      <span className="text-black">
                        {moment(invoice.data?.created_at).format("LLLL")}
                      </span>
                    </h3>
                  </div>
                </div>
                <Separator
                  orientation="horizontal"
                  className="h-px w-full bg-gray-200"
                />
                <div className="flex flex-col space-y-2 overflow-y-scroll">
                  {invoice.data?.products.map((product) => (
                    <div className="flex flex-1 gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg border lg:h-24 lg:w-24">
                        <Image
                          src={product.product.featured_image_url}
                          fill
                          alt={product.product.name}
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between lg:flex-row">
                        <span className="inline w-full text-sm lg:w-fit">
                          {product.product.name}
                        </span>
                        <div className="flex w-full flex-col gap-2 lg:w-fit lg:items-end">
                          <h5 className="text-sm">
                            Rp. {product.product.price.toLocaleString("id")}
                          </h5>
                          <h5 className="text-sm text-gray-500">
                            Amount: {product.amount}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Separator
                  orientation="horizontal"
                  className="h-px w-full bg-gray-200"
                />
                <div className="flex gap-6">
                  <div className="w-1/2">
                    <h3 className="text-sm font-medium lg:text-base">
                      Payment
                    </h3>
                  </div>
                  <div className="w-1/2 space-y-2">
                    <h3 className="text-sm font-medium lg:text-base">
                      Delivery
                    </h3>
                    <span className="text-xs lg:text-sm">
                      {invoice.data?.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
