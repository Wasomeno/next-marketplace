import { CheckoutPaymentModal } from "@/components/user/checkout/checkout-payment-modal"
import { CheckoutSelectedCartItems } from "@/components/user/checkout/checkout-selected-cart-items"
import { CheckoutSummary } from "@/components/user/checkout/checkout-summary"
import { getUserAddress } from "@/app/actions/user-details"

export const metadata = {
  title: "Checkout | Next Marketplace",
}

export default async function CheckoutPage() {
  const userAddress = await getUserAddress()
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
            <span className="text-xs text-slate-500 lg:text-sm">
              {userAddress}
            </span>
          </div>
          <CheckoutSelectedCartItems />
        </div>
        <CheckoutSummary />
      </div>
      <CheckoutPaymentModal />
    </div>
  )
}
