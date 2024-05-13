"use client"

import React, { useState } from "react"
import { deleteMultipleProduct } from "@/actions/store/products"
import { storeQueryKeys } from "@/modules/user/common/queryKeys/storeQueryKeys"
import { useMutation } from "@tanstack/react-query"
import { BsTrash3 } from "react-icons/bs"
import { toast } from "sonner"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

export const StoreProductMultipleDeleteModal: React.FC<{
  storeId: number
  selectedIds: number[]
}> = ({ selectedIds }) => {
  const [isOpen, setIsOpen] = useState(false)

  const deleteProductsMutation = useMutation({
    mutationFn: async () => {
      await deleteMultipleProduct(selectedIds)
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
      <Button
        variant="defaultOutline"
        size="sm"
        disabled={!selectedIds.length}
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 px-0 shadow-sm disabled:hover:bg-white lg:h-9 lg:w-auto lg:px-2.5"
      >
        <span className="hidden text-xs lg:inline">Remove</span> <BsTrash3 />
      </Button>
      <ConfirmationDialog
        open={isOpen}
        title={"Delete Multiple Products"}
        body={`Are you sure want to delete ${selectedIds.length} products? This action can't be undone`}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        onConfirm={deleteProductsMutation.mutate}
      />
    </>
  )
}
