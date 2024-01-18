import Link from "next/link"
import { IoCartOutline } from "react-icons/io5"

import { getCartItemsCount } from "@/app/actions/user/cart"

export async function CartButton() {
  const cartItemCount = await getCartItemsCount()
  return (
    <Link href="/cart" className="relative font-sans">
      <IoCartOutline className="h-6 w-6 fill-slate-500 lg:h-7 lg:w-7" />
      {cartItemCount !== 0 && (
        <div className="flex-items-center absolute -right-2.5 -top-2 flex h-5 w-5 justify-center rounded-full  border-2 border-white bg-red-600 text-xs font-semibold text-white lg:h-5 lg:w-5 lg:text-xs dark:border-neutral-950">
          {cartItemCount}
        </div>
      )}
    </Link>
  )
}
