"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { ConfirmationDialog } from "@/components/confirmation-dialog"

export const AddressNotSetModal = () => {
  const router = useRouter()

  return (
    <ConfirmationDialog
      open
      title="You have not set your address"
      body="You must set one address to be your main address in the settings page. Go to settings page?"
      onConfirm={() => router.push("/settings/address")}
      onCancel={() => router.push("/cart")}
    />
  )
}
