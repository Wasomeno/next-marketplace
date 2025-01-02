"use client"

import React, { useState } from "react"
import { toast } from "sonner"

import { deleteSingleProduct } from "@/actions/store/products"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { TableActions } from "@/components/table-actions"
import { Product } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { storeQueryKeys } from "../../../_query/keys"

export const StoreProductSingleDeleteModal: React.FC<{
  product: Product
}> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()
  const deleteMultipleProductMutation = useMutation({
    mutationFn: async () => {
      await deleteSingleProduct(product.id)
    },
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({
        queryKey: storeQueryKeys.products().baseKey,
      })
      toast.success("Successfully deleted products")
    },
    onError: () => toast.error("Error when deleting products"),
  })
  return (
    <>
      <TableActions.Delete onClick={() => setIsOpen(true)} type="button" />
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
