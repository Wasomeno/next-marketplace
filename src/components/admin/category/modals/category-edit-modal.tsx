"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getCategoryDetails } from "@/app/actions/categories"

// async function updateCategory(name: string, id: number) {
//   await fetch("/api/categories/" + id, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name,
//     }),
//   })
// }

const CategoryEditModal = () => {
  const [categoryName, setCategoryName] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = parseInt(searchParams.get("id") ?? "0")
  const isEditModalOpen = searchParams.get("edit") !== null

  const categoryDetails = useQuery(
    ["categoryDetails", categoryId],
    async () => await getCategoryDetails(categoryId)
  )

  // const updateMutation = useMutation(
  //   () =>
  //     toast.promise(updateCategory(categoryName, categoryDetails.id), {
  //       error: "Error",
  //       success: "Update Success",
  //       pending: "Updating " + categoryDetails.name,
  //     }),
  //   {
  //     onMutate: () => router.push("/admin/categories"),
  //     onSuccess: () => queryClient.invalidateQueries(["categories"]),
  //   }
  // )

  useLayoutEffect(() => {
    if (!categoryDetails.isLoading) {
      setCategoryName(categoryDetails?.data?.name as string)
    }
  }, [categoryDetails.isLoading])

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={() => router.push("/admin/categories")}
    >
      <DialogContent open={isEditModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Edit Category" />
        <form
          onSubmit={(event) => {
            event.preventDefault()
          }}
          className="flex w-full flex-col gap-4 px-6 py-4"
        >
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-gray-400">Id</label>
            <h5 className="text-lg">{categoryId}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">Name</label>
            <Input
              type="text"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              value={categoryName}
              onChange={(event) => {
                setCategoryName(event.target.value)
              }}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">
              Products
            </label>
            <h5 className="text-lg">
              {categoryDetails?.data?.products?.length}
            </h5>
          </div>
          <div className="items-ceneter flex justify-center gap-4">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryEditModal
