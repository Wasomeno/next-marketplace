import React, { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Id, toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface DeleteCategoriesModalProps {
  selectedCategories: Array<number>
}

export const DeleteCategoriesModal = ({
  selectedCategories,
}: DeleteCategoriesModalProps) => {
  const toastRef = useRef<Id>(0)
  const searchParams = useSearchParams()
  const router = useRouter()

  const isDeleteModalOpen = searchParams.get("delete") !== null
  const deleteCategories = useMutation(
    () =>
      axios.post("/api/categories/delete", {
        categoryIds: selectedCategories,
      }),
    {
      onMutate() {
        toastRef.current = toast.loading("Deleting categories")
        router.push("/admin/categories")
      },
      onSuccess(response) {
        toast.update(toastRef.current, {
          type: "success",
          render: response.data.message,
          isLoading: false,
          autoClose: 1000,
        })
        queryClient.invalidateQueries(["categories"])
      },
      onError(response: string) {
        toast.update(toastRef.current, {
          type: toast.TYPE.ERROR,
          render: response,
        })
      },
    }
  )

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={() => router.push("/admin/categories")}
    >
      <DialogContent open={isDeleteModalOpen} className="lg:h-2/6 lg:w-2/6">
        <div className="flex h-full flex-col items-center justify-between">
          <div className="flex h-5/6 flex-col justify-center gap-2.5 text-center">
            <h5 className="text-base lg:text-lg">Delete Categories</h5>
            <p className="text-xs lg:text-sm">
              Continue delete {selectedCategories.length} selected categories?
            </p>
          </div>
          <div className="flex h-20 w-3/6 items-center justify-evenly">
            <button
              onClick={() => deleteCategories.mutate()}
              className="w-20 rounded-lg border py-2.5 text-sm"
            >
              Continue
            </button>
            <button
              onClick={() => router.push("/admin/categories")}
              className="w-20 rounded-lg border py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
