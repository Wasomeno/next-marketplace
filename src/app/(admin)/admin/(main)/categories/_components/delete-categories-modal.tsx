import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { BsTrash3 } from "react-icons/bs"
import { toast } from "sonner"

import { deleteCategories } from "@/actions/categories"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { queryClient } from "@/lib/react-query-client"
import { categoryQueryKeys } from "@/query/queryKeys/categoryQueryKeys"
import { useMutation } from "@tanstack/react-query"

interface DeleteCategoriesModalProps {
  selectedCategories: Array<number>
}

export function DeleteCategoriesModal({
  selectedCategories,
}: DeleteCategoriesModalProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlSearchParams = new URLSearchParams(searchParams)

  const open = searchParams.get("delete") !== null
  const deleteCategoriesMutation = useMutation({
    mutationFn: async () =>
      await deleteCategories({ categoryIds: selectedCategories }),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all().baseKey,
      })
      closeDeleteCategoryModal()
      toast.success("Succesfully deleted Categories")
    },
    onError() {
      toast.error("Error when deleting categories")
    },
  })

  function openDeleteCategoryModal() {
    urlSearchParams.set("delete", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }
  function closeDeleteCategoryModal() {
    urlSearchParams.delete("delete")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  function onOpenChange(isOpen: boolean) {
    if (isOpen) {
      openDeleteCategoryModal()
    } else {
      closeDeleteCategoryModal()
    }
  }

  return (
    <>
      <Button
        variant="defaultOutline"
        size="sm"
        disabled={selectedCategories.length < 1}
        onClick={openDeleteCategoryModal}
        className="h-8 w-8 shadow-sm  lg:h-9 lg:w-9"
      >
        <BsTrash3 />
      </Button>
      <ConfirmationDialog
        open={open}
        title="Delete Category"
        body={`Confirm delete ${selectedCategories.length} category?`}
        onOpenChange={onOpenChange}
        onConfirm={deleteCategoriesMutation.mutate}
      />
    </>
  )
}
