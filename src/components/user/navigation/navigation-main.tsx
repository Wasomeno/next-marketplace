import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { CartItemCount } from "./cart-item-count";
import { SearchProduct } from "./search-product";
import { UserMenu } from "./user-menu";

export async function NavigationMain() {
  const session = await getServerSession(authOptions);
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-b-gray-200 bg-white px-4 shadow-sm">
      <div className="flex w-full items-center lg:w-3/6">
        <Link
          href="/"
          prefetch={false}
          className="relative hidden w-32 justify-center lg:flex"
        >
          <Image
            src="/next_marketplace.webp"
            alt="next-logo"
            height={80}
            width={80}
          />
        </Link>
        <SearchProduct />
      </div>
      <div className="flex w-2/6 items-center justify-evenly lg:w-1/6">
        <Link href="/cart" className="relative font-sans">
          <IoCartOutline className="h-6 w-6 fill-slate-500 lg:h-7 lg:w-7" />
          <CartItemCount user={session?.user?.email} />
        </Link>
        <div className="flex justify-center">
          <UserMenu session={session} />
        </div>
      </div>
    </div>
  );
}
