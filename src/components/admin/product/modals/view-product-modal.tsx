"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getProduct } from "@/app/actions/products"

export function ViewProductModal() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const productId = parseInt(searchParams.get("id") as string)
  const isDetailsModalOpen = searchParams.get("view") !== null

  const productDetails = useQuery(
    ["productDetails", productId],
    async () => await getProduct(productId),
    { enabled: isDetailsModalOpen }
  )

  return (
    <Dialog
      open={isDetailsModalOpen}
      onOpenChange={() => router.push("/admin/products")}
    >
      <DialogContent open={isDetailsModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Product Details" />
        <div className="flex w-full flex-col gap-4 px-6">
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Id</h6>
            <h5 className="text-lg">{productDetails.data?.id}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Name</h6>
            <h5 className="text-lg">{productDetails.data?.name}</h5>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
