import Image from "next/image"
import Link from "next/link"
import { getServerSession } from "next-auth"
import invariant from "tiny-invariant"

import { authOptions } from "@/config/next-auth"

export default async function UserSettingsPage() {
  const session = await getServerSession(authOptions)
  invariant(session)
  return (
    <div className="flex flex-1 flex-col gap-6 rounded-lg border border-gray-200 p-4 shadow-sm lg:flex-row">
      <div className="flex w-full flex-col items-center gap-2 lg:w-64 lg:items-start">
        <div className="relative h-64 w-64 rounded-lg border border-gray-200 bg-gray-50">
          <Image
            src={session.user.picture as string}
            alt="user-profile-image"
            fill
          />
        </div>
        <button className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium">
          Select photo
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="mb-2 font-medium">User Profile</h2>
        <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
          <span className="w-48">Name</span>
          <span className="font-medium">{session.user.name}</span>
        </div>
        <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
          <span className="w-48">Email</span>
          <span className="font-medium">{session.user.email}</span>
        </div>
        <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
          <span className="w-48">Phone Number</span>
          <span className="font-medium">081234-1i4141-8081</span>
        </div>
        <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
          <span className="w-48">Gender</span>
          <span className="font-medium">Male</span>
        </div>
        <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
          <span className="w-48">Date & Birth</span>
          <span className="font-medium">03-04-2000</span>
        </div>
      </div>
    </div>
  )
}
