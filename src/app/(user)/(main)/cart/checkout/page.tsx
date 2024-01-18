import { CheckoutPaymentModal } from "@/components/user/checkout/checkout-payment-modal"
import { CheckoutSelectedCartItems } from "@/components/user/checkout/checkout-selected-cart-items"
import { CheckoutSummary } from "@/components/user/checkout/checkout-summary"
import { getUserAddress } from "@/app/actions/user/user-details"

export const metadata = {
  title: "Checkout | Next Marketplace",
}

export default async function CheckoutPage() {
  const address = await getUserAddress()
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 px-4 lg:px-8">
        <h1 className="text-base font-medium lg:text-xl">Checkout</h1>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 lg:flex-row">
        <div className="w-full lg:w-4/6">
          <div className="mb-4 flex flex-col gap-1 px-4 lg:px-8">
            <h5 className="text-xs font-medium lg:text-base">
              Shipping Address
            </h5>
            <div className="w-ful relative rounded-md border  border-gray-200 shadow-sm lg:w-72">
              <div className="flex flex-col gap-2 px-4 py-2">
                <span className="text-sm">{address?.recipient}</span>
                <span className="text-sm">
                  {address?.province}, {address?.city}, {address?.subdistrict}
                </span>
                <span className="text-sm">
                  {address?.street}, {address?.postNumber}
                </span>
                <span className="text-sm">{address?.phoneNumber}</span>
              </div>
              <div className="absolute bottom-2 right-2 w-16 rounded-full border border-blue-100 bg-blue-200 py-1 text-center text-xs">
                Main
              </div>
            </div>
          </div>
          <CheckoutSelectedCartItems />
        </div>
        <CheckoutSummary />
      </div>
      <CheckoutPaymentModal />
    </div>
  )
}
