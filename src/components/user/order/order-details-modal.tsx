"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { FaSpinner } from "react-icons/fa"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { getUserInvoice } from "@/app/actions/user/invoice"

export function OrderDetailsModal() {
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
          className="flex w-full flex-col gap-4 lg:h-4/6 lg:w-3/6"
        >
          <DialogHeader title="Order Details" />
          {invoice.isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <FaSpinner className="animate-spin fill-blue-500" size={30} />
            </div>
          ) : (
            <>
              <div className="px-4">
                <span className="rounded-lg bg-blue-200 px-3 py-2 text-xs font-medium lg:text-sm dark:bg-blue-900">
                  {invoice.data?.status}
                </span>
                <div className="my-4 flex items-center justify-between text-sm">
                  <span className="font-medium">Invoice Id</span>
                  <span>{invoice.data?.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Transaction Date</span>
                  <span>{date.toDateString()}</span>
                </div>
              </div>
              <div className="mt-6 px-4">
                <span className="text-sm font-semibold lg:text-base">
                  Products
                </span>
                <div className="mt-s flex flex-col gap-2.5">
                  {invoice.data?.products.map((orderProduct) => (
                    <div
                      key={orderProduct.id}
                      className="flex items-center gap-4 border-t p-4 dark:border-t-neutral-700"
                    >
                      <div className="flex w-full flex-wrap items-end justify-between gap-2">
                        <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
                          <div className="relative h-20 w-28 rounded-md bg-slate-300 lg:h-20 lg:w-24 dark:bg-neutral-400">
                            <Image
                              src={orderProduct.product.featured_image_url}
                              alt="product-image"
                              fill
                            />
                          </div>
                          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
                            <span className="text-sm font-medium">
                              {orderProduct.product.name}
                            </span>
                            <span className="text-sm">
                              Rp{" "}
                              {orderProduct.product.price.toLocaleString("id")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
