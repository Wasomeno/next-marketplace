"use client"

import React, { useState } from "react"
import { deleteSingleProduct } from "@/actions/store/products"
import { storeQueryKeys } from "@/modules/user/common/queryKeys/storeQueryKeys"
import { Product } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { TableActions } from "@/components/table-actions"

export const StoreProductSingleDeleteModal: React.FC<{
  product: Product
}> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false)
  const deleteMultipleProductMutation = useMutation({
    mutationFn: async () => {
      await deleteSingleProduct(product.id)
    },
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({
        queryKey: storeQueryKeys.products({ storeId: product.store_id }),
      })
      toast.success("Successfully deleted products")
    },
    onError: () => toast.error("Error when deleting products"),
  })
  return (
    <>
      <TableActions.Delete onClick={() => setIsOpen(true)} asLink={false} />
      <ConfirmationDialog
        open={isOpen}
        title={"Delete Product"}
        body={`Are you sure want to delete ${product.name} ? This action can't be undone`}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        onConfirm={deleteMultipleProductMutation.mutate}
      />
    </>
  )
}
