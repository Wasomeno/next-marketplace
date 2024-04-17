import Link from "next/link"
import { setMainAddress } from "@/actions/user/settings"
import { AddAddressModal } from "@/modules/user/setting-page/components/add-address-modal"
import { AddressCard } from "@/modules/user/setting-page/components/address-card"
import clsx from "clsx"
import { getServerSession } from "next-auth"
import { BiPlus } from "react-icons/bi"
import { toast } from "react-toastify"
import invariant from "tiny-invariant"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"
import { buttonVariants } from "@/components/ui/button"

type Props = {
  params: Record<string, string>
  searchParams: { add?: string }
}

export default async function UserAddressSetting(props: Props) {
  const session = await getServerSession(authOptions)

  invariant(session)

  const addresses = await prisma.userAddress.findMany({
    where: { userEmail: session.user.email as string },
  })

  const isAdd = props.searchParams.add !== undefined

  return (
    <div className="flex flex-1 flex-col rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-10">
        <h2 className="text-lg font-medium">Your Addresses</h2>
        <Link
          href="?add=true"
          className={clsx(
            buttonVariants({ size: "sm", variant: "default" }),
            "flex items-center gap-2"
          )}
        >
          <BiPlus /> Address
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {addresses.length > 0 &&
          addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        {addresses.length < 1 && (
          <span className="text-sm">
            You don{`'`}t have any active addresses
          </span>
        )}
      </div>
      {isAdd && <AddAddressModal />}
    </div>
  )
}
