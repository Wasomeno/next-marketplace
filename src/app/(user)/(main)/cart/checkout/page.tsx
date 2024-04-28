import { getUserAddress } from "@/actions/user/user-details"
import { CheckoutItems } from "@/modules/user/checkout-page/components/checkout-items"
import { CheckoutPaymentModal } from "@/modules/user/checkout-page/components/checkout-payment-modal"
import { CheckoutSummary } from "@/modules/user/checkout-page/components/checkout-summary"
import invariant from "tiny-invariant"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Checkout",
}

export default async function CheckoutPage() {
  const address = await getUserAddress()

  invariant(address)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="px-4 lg:px-8">
        <h1 className="text-base font-medium lg:text-xl">Checkout</h1>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 lg:flex-row">
        <div className="w-full space-y-4 px-4 lg:w-4/6 lg:px-8">
          <div className="space-y-2 rounded-lg border p-4 shadow-sm lg:space-y-3">
            <h2 className="text-sm font-medium lg:text-base">Your Address</h2>
            <p className="text-xs lg:text-sm">
              {`${address.street}, ${address.subdistrict}, ${address.city},
              ${address.province}, ${address.postNumber} (${address.recipient})`}
            </p>
            <div className="flex justify-end lg:justify-start">
              {/* TODO: Add function for changing the address */}
              <Button size="sm" className="h-8 w-24 lg:text-xs">
                Change
              </Button>
            </div>
          </div>
          <CheckoutItems />
        </div>
        <CheckoutSummary />
      </div>
      <CheckoutPaymentModal
        address={`${address?.recipient} ${address?.province} ${address?.city} ${address?.subdistrict} ${address?.street} ${address?.postNumber} ${address?.phoneNumber}`}
      />
    </div>
  )
}
