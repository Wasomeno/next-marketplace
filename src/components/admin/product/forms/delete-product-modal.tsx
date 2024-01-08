import React, { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Id, toast } from "react-toastify"

import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { deleteProduct } from "@/app/actions/products"

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
  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(selectedProducts),
    onMutate() {
      toastRef.current = toast.loading(
        `Deleting ${selectedProducts.length} products`
      )
    },
    onSuccess() {
      toast.update(toastRef.current, {
        type: "success",
        render: `Successfully deleted ${selectedProducts.length} products`,
        isLoading: false,
        autoClose: 1000,
      })
      router.push("/admin/products")
    },
    onError(response: string) {
      toast.update(toastRef.current, {
        type: toast.TYPE.ERROR,
        render: response,
      })
    },
  })

  return (
    <ConfirmationDialog
      open={isDeleteModalOpen}
      title="Delete Product"
      body={`Confirm delete ${selectedProducts.length} product?`}
      onOpenChange={() => router.push("/admin/products")}
      onConfirm={deleteProductMutation.mutate}
      onCancel={() => router.push("/admin/products")}
    />
  )
}
