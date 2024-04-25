import Image from "next/image"
import { getServerSession } from "next-auth"
import invariant from "tiny-invariant"

import { authOptions } from "@/config/next-auth"

export default async function UserSettingsPage() {
  const session = await getServerSession(authOptions)
  invariant(session)
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium lg:text-lg">Profile</h2>
      <div className="flex flex-wrap gap-6">
        <div className="flex w-full flex-col items-center gap-2 lg:w-64 lg:items-start">
          <div className="relative h-36 w-36 overflow-hidden rounded-lg border border-gray-200 shadow-sm lg:h-64 lg:w-64">
            <Image
              src={session.user.picture as string}
              alt="user-profile-image"
              fill
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48 text-gray-400">Name</span>
            <span>{session.user.name}</span>
          </div>
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48 text-gray-400">Email</span>
            <span>{session.user.email}</span>
          </div>
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48 text-gray-400">Phone Number</span>
            <span>081234-1i4141-8081</span>
          </div>
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48 text-gray-400">Gender</span>
            <span>Male</span>
          </div>
          <div className="flex flex-col items-start gap-2  text-sm lg:flex-row lg:items-center">
            <span className="w-48 text-gray-400">Date & Birth</span>
            <span>03-04-2000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
