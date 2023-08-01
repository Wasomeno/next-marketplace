import Image from "next/image";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

import { getCartItemsCount } from "@/app/actions/cart";
import { Separator } from "@/components/ui/separator";

import { SearchProduct } from "./search-product";
import { UserMenu } from "./user-menu";

export async function NavigationMain() {
  const cartItemCount = await getCartItemsCount();
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-b-gray-200 bg-white px-4 shadow-sm">
      <div className="flex w-full items-center gap-2 lg:w-3/6">
        <Link
          href="/"
          className="relative flex h-12 w-12 justify-center lg:h-16 lg:w-16"
        >
          <Image src="/next_marketplace.webp" alt="next-logo" fill />
        </Link>
        <SearchProduct />
      </div>
      <div className="flex w-3/6 items-center justify-evenly lg:w-44">
        <Link href="/cart" className="relative font-sans">
          <IoCartOutline className="h-6 w-6 fill-slate-500 lg:h-7 lg:w-7" />
          {cartItemCount !== 0 && (
            <div className="flex-items-center absolute -right-2.5 -top-2 flex h-5 w-5 justify-center rounded-full  border-2 border-white bg-red-600 text-xs font-semibold text-white lg:h-6 lg:w-6 lg:text-sm">
              {cartItemCount}
            </div>
          )}
        </Link>
        <Separator
          className="h-7 w-px rounded-full bg-slate-200"
          orientation="vertical"
        />
        <UserMenu />
      </div>
    </div>
  );
}
