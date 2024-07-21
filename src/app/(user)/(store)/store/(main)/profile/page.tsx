import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

import { StoreProfileForm } from "./_components/store-profile-form"
import { StoreProfileImageUpload } from "./_components/store-profile-image-upload"

export default async function StoreProfilePage() {
  const session = await getServerSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const store = await prisma.store.findUnique({
    where: { owner_email: session.user.email },
  })

  if (!store) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 flex-col gap-2 lg:gap-4">
      <h1 className="text-base font-medium lg:text-2xl">Store Profile</h1>
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-10 ">
        <StoreProfileImageUpload storeId={store.id} />
        <StoreProfileForm store={store} />
      </div>
    </div>
  )
}
