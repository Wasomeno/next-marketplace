import React, { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Id, toast } from "react-toastify"

import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { deleteCategories } from "@/app/actions/admin/categories"

interface DeleteCategoriesModalProps {
  selectedCategories: Array<number>
}

export function DeleteCategoriesModal({
  selectedCategories,
}: DeleteCategoriesModalProps) {
  const toastRef = useRef<Id>(0)
  const searchParams = useSearchParams()
  const router = useRouter()

  const open = searchParams.get("delete") !== null
  const deleteCategoriesMutation = useMutation({
    mutationFn: async () =>
      await deleteCategories({ categoryIds: selectedCategories }),
    onMutate() {
      toastRef.current = toast.loading("Deleting categories")
      router.push("/admin/categories")
    },
    onSuccess() {
      toast.update(toastRef.current, {
        type: "success",
        render: "Succesfully Delete Categories",
        isLoading: false,
        autoClose: 1000,
      })
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
      open={open}
      body={`Confirm delete ${selectedCategories.length} category?`}
      onOpenChange={() => router.push("/admin/categories")}
      onConfirm={deleteCategoriesMutation.mutate}
      onCancel={() => router.push("/admin/categories")}
    />
  )
}
