import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

import { AddAddressModal } from "./_components/add-address-modal"
import { AddressCard } from "./_components/address-card"
import { SetMainAddressConfirmationDialog } from "./_components/set-main-address-confirmation-dialog"

type Props = {
  params: Record<string, string>
  searchParams: { add?: string; mainAddressConfirm?: string; id?: string }
}

export default async function UserAddressSetting(props: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const addresses = await prisma.userAddress.findMany({
    where: { userEmail: session.user.email as string },
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between lg:mb-4">
        <h2 className="text-sm font-medium lg:text-lg">Your Addresses</h2>
        <AddAddressModal />
      </div>
      <div className="flex flex-wrap gap-2 lg:gap-4">
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
      <SetMainAddressConfirmationDialog
        selectedAddress={addresses.find(
          (address) => address.id.toString() === props.searchParams.id
        )}
      />
    </div>
  )
}
