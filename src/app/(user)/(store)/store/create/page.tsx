import React from "react"
import { Metadata } from "next"

import { CreateStoreForm } from "@/components/user/store/create-store-form"

export const metadata: Metadata = {
  title: "Create Your Own Store",
}

export default async function UserCreateStorePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <CreateStoreForm />
    </div>
  )
}
