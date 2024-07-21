"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"

import { getUserAddresses, setMainAddress } from "@/actions/user/settings"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTrigger,
} from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { queryClient } from "@/lib/react-query-client"
import { useMutation, useQuery } from "@tanstack/react-query"

export const CheckoutChangeAddressModal: React.FC<{ userEmail: string }> = ({
  userEmail,
}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const addresses = useQuery({
    queryKey: ["userAddressess", userEmail],
    queryFn: () => getUserAddresses(userEmail),
  })

  const isOpen = searchParams.get("changeAddress") !== null

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams)
    if (isOpen) {
      urlSearchParams.set("changeAddress", "true")
      router.replace(`${pathname}?${urlSearchParams.toString()}`)
    } else {
      urlSearchParams.delete("changeAddress")
      router.replace(`${pathname}?${urlSearchParams.toString()}`)
    }
  }

  const setMainAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      await setMainAddress(addressId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userAddressess", userEmail],
      })
      toast.success("Succesfully changed address")
    },
    onError: () => {
      toast.error("Error when changing address")
    },
  })

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogTrigger asChild>
        <Button size="sm" className="h-8 w-24 lg:text-xs">
          Change
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent open={isOpen} className="h-5/6 w-full lg:w-2/6">
        <ResponsiveDialogHeader title="Your Addresses" />
        <div className="space-y-4 p-4">
          {!addresses.isLoading &&
            addresses.data?.map((address) => (
              <div
                key={address.id}
                className="relative w-full rounded-md border  border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                  <span className="text-sm font-medium">
                    {address.title}{" "}
                    {address.isMainAddress && (
                      <span className="ml-1 rounded-md bg-gray-200 p-1 text-xs">
                        Main
                      </span>
                    )}
                  </span>
                  {!address.isMainAddress && (
                    <Button
                      className="h-8 lg:text-xs"
                      disabled={setMainAddressMutation.isPending}
                      onClick={() => setMainAddressMutation.mutate(address.id)}
                    >
                      {setMainAddressMutation.isPending && (
                        <ImSpinner8 className="animate-spin" />
                      )}
                      Select
                    </Button>
                  )}
                </div>
                <div className="flex flex-col gap-2 px-4 py-2">
                  <span className="text-sm">{address.recipient}</span>
                  <span className="text-sm">
                    {address.province}, {address.city}, {address.subdistrict}
                  </span>
                  <span className="text-sm">
                    {address.street}, {address.postNumber}
                  </span>
                  <span className="text-sm">{address.phoneNumber}</span>
                </div>
              </div>
            ))}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
