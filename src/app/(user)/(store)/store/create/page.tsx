import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUserStore } from "@/actions/user/user-details"
import { CreateStoreForm } from "@/modules/user/store/create-store-page/components/create-store-form"

export const metadata: Metadata = {
  title: "Create Your Own Store",
}

export default async function UserCreateStorePage() {
  const store = await getUserStore()

  if (store) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <CreateStoreForm />
    </div>
  )
}
