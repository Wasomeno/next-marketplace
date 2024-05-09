import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { deleteMultipleBanners } from "@/actions/admin/banner"
import { bannersQuery } from "@/modules/user/common/queryOptions/bannerQueryOptions"
import { useMutation } from "@tanstack/react-query"
import { BsTrash3 } from "react-icons/bs"
import { toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface DeleteBannersModalProps {
  selectedBanners: Array<number>
}

export function DeleteBannerModal({
  selectedBanners,
}: DeleteBannersModalProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlSearchParams = new URLSearchParams(searchParams)

  const open = searchParams.get("delete") !== null
  const deleteCategoriesMutation = useMutation({
    mutationFn: async () => deleteMultipleBanners({ ids: selectedBanners }),
    onSuccess() {
      queryClient.invalidateQueries(bannersQuery())
      closeDeleteBannerModal()
      toast.success("Succesfully deleted Banners")
    },
    onError() {
      toast.error("Error when deleting banners")
    },
  })

  function openDeleteBannerModal() {
    urlSearchParams.set("delete", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  function closeDeleteBannerModal() {
    urlSearchParams.delete("delete")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  function onOpenChange(isOpen: boolean) {
    if (isOpen) {
      openDeleteBannerModal()
    } else {
      closeDeleteBannerModal()
    }
  }

  return (
    <>
      <Button
        variant="defaultOutline"
        size="sm"
        disabled={selectedBanners.length < 1}
        onClick={openDeleteBannerModal}
        className="h-8 w-8 shadow-sm  lg:h-9 lg:w-9"
      >
        <BsTrash3 />
      </Button>
      <ConfirmationDialog
        open={open}
        title="Delete Banner"
        body={`Confirm delete ${selectedBanners.length} banners?`}
        onOpenChange={onOpenChange}
        onConfirm={deleteCategoriesMutation.mutate}
      />
    </>
  )
}
