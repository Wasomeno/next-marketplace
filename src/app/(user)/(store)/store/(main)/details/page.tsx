import Image from "next/image"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { StoreProfileImageUpload } from "@/components/user/store/store-profile-image-upload"

export default async function StoreDetailsPage() {
  const session = await getServerSession()
  const store = await prisma.store.findUnique({
    where: { owner_email: session?.user.email as string },
  })

  return (
    <div className="flex flex-1 flex-col gap-2 lg:gap-4">
      <h1 className="text-lg font-medium lg:text-2xl">Store Details</h1>
      <div className="flex gap-4">
        <StoreProfileImageUpload />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48">Name</span>
            <span className="font-medium">{store?.name}</span>
          </div>
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48">Location</span>
            <span className="font-medium">{store?.location}</span>
          </div>
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48">Description</span>
            <p className="font-medium">{store?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
