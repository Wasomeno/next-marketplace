import React, { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Id, toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface DeleteProductsModalProps {
  selectedProducts: Array<number>
  isDeleteModalOpen: boolean
  setDeleteModalOpen: (open: boolean) => void
}

export const DeleteProductsModal = ({
  selectedProducts,
  isDeleteModalOpen,
  setDeleteModalOpen,
}: DeleteProductsModalProps) => {
  const toastRef = useRef<Id>(0)
  const deleteProduct = useMutation(
    () =>
      axios.post("/api/products/delete", {
        productIds: selectedProducts,
      }),
    {
      onMutate() {
        toastRef.current = toast.loading("Deleting products")
        setDeleteModalOpen(false)
      },
      onSuccess(response) {
        toast.update(toastRef.current, {
          type: "success",
          render: response.data.message,
          isLoading: false,
          autoClose: 1000,
        })
        queryClient.invalidateQueries(["products"])
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
      onOpenChange={(open) => setDeleteModalOpen(open)}
    >
      <DialogContent open={isDeleteModalOpen} className="lg:h-2/6 lg:w-2/6">
        <div className="flex h-full flex-col items-center justify-between">
          <div className="flex h-5/6 flex-col justify-center gap-2.5 text-center">
            <h5 className="text-base lg:text-lg">Delete Products</h5>
            <p className="text-xs lg:text-sm">
              Continue delete {selectedProducts.length} selected products?
            </p>
          </div>
          <div className="flex h-20 w-3/6 items-center justify-evenly">
            <button
              onClick={() => deleteProduct.mutate()}
              className="w-20 rounded-lg border py-2.5 text-sm"
            >
              Continue
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
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
