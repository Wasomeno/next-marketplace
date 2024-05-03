import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/actions/store/user"
import { getUserStore } from "@/actions/user/user-details"
import { CreateStoreForm } from "@/modules/user/store/create-store-page/components/create-store-form"

export const metadata: Metadata = {
  title: "Create Your Own Store",
}

export default async function UserCreateStorePage() {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const store = await getUserStore({ userEmail: session.user.email })

  if (store) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <CreateStoreForm />
    </div>
  )
}
