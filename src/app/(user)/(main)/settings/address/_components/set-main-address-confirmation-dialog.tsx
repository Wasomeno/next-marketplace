"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { setMainAddress } from "@/actions/user/settings"
import { UserAddress } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { ConfirmationDialog } from "@/components/confirmation-dialog"

export const SetMainAddressConfirmationDialog = ({
  selectedAddress,
}: {
  selectedAddress?: UserAddress
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isOpen = searchParams.get("mainAddressConfirm") !== null

  const setMainAddressMutation = useMutation({
    mutationFn: async () => {
      selectedAddress?.id ? await setMainAddress(selectedAddress.id) : null
    },
    onSuccess: () =>
      toast.success(
        `Succesfully set ${selectedAddress?.title} as your main address`
      ),
    onError: () => toast.error("Error when setting the main address"),
    onSettled: () => closeModal(),
  })

  function closeModal() {
    const urlSearchParams = new URLSearchParams(searchParams)
    urlSearchParams.delete("mainAddressConfirm")
    urlSearchParams.delete("id")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  return (
    <ConfirmationDialog
      onConfirm={setMainAddressMutation.mutate}
      onCancel={closeModal}
      onOpenChange={closeModal}
      open={isOpen}
      title="Setting Main Address"
      body={
        <span>
          Are you sure you want to set{" "}
          <span className="font-semibold">{selectedAddress?.title}</span> as
          your main address?
        </span>
      }
    />
  )
}
