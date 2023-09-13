"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getCategoryDetails } from "@/app/actions/categories"

export function ViewCategoryDetailsModal() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = parseInt(searchParams.get("id") ?? "0")
  const isDetailsModalOpen = searchParams.get("view") !== null

  const categoryDetails = useQuery(
    ["categoryDetails", categoryId],
    async () => await getCategoryDetails(categoryId)
  )

  return (
    <Dialog
      open={isDetailsModalOpen}
      onOpenChange={() => router.push("/admin/categories")}
    >
      <DialogContent open={isDetailsModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Category Details" />
        <div className="flex w-full flex-col gap-4 px-6">
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Id</h6>
            <h5 className="text-lg">{categoryDetails.data?.id}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Name</h6>
            <h5 className="text-lg">{categoryDetails.data?.name}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Products</h6>
            <h5 className="text-lg">
              {categoryDetails.data?.products?.length}
            </h5>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
