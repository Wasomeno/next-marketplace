import React, { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Id, toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

type DeleteProductModalProps = {
  selectedProducts: Array<number>
}

export function DeleteProductModal({
  selectedProducts,
}: DeleteProductModalProps) {
  const toastRef = useRef<Id>(0)

  const router = useRouter()
  const searchParams = useSearchParams()

  const isDeleteModalOpen = searchParams.get("delete") !== null
  const deleteProduct = useMutation(
    () =>
      axios.post("/api/products/delete", {
        productIds: selectedProducts,
      }),
    {
      onMutate() {
        toastRef.current = toast.loading("Deleting products")
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
    <ConfirmationDialog
      open={isDeleteModalOpen}
      title="Delete Product"
      body={`Confirm delete ${selectedProducts.length} product?`}
      onOpenChange={() => router.push("/admin/products")}
      onConfirm={deleteProduct.mutate}
      onCancel={() => router.push("/admin/products")}
    />
  )
}
