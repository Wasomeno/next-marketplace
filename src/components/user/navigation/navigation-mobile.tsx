"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { BiCategory } from "react-icons/bi";
import { BsCardList, BsHouseDoor } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export const NavigationMobile = () => {
  const pathname = usePathname();
  const params = useParams();

  if (params?.product || pathname === "/cart") return;
  return (
    <div className="sticky bottom-0 z-10 flex h-14 w-full items-center justify-around border-t bg-white p-2 md:hidden">
      <Link href="/" className="flex flex-col items-center gap-1.5">
        <BsHouseDoor
          size="18"
          className={twMerge(
            "text-slate-400",
            pathname === "/" && "text-blue-500"
          )}
        />
        <span
          className={twMerge(
            "text-xs text-slate-400",
            pathname === "/" && "text-blue-500"
          )}
        >
          Home
        </span>
      </Link>
      <Link href="/categories" className="flex flex-col items-center gap-1">
        <BiCategory
          size="18"
          className={twMerge(
            "text-slate-400",
            pathname === "/categories" && "text-blue-500"
          )}
        />
        <span
          className={twMerge(
            "text-xs text-slate-400",
            pathname === "/categories" && "text-blue-500"
          )}
        >
          Categories
        </span>
      </Link>
      <Link href="/orders" className="flex flex-col items-center gap-1">
        <BsCardList
          size="18"
          className={twMerge(
            "text-slate-400",
            pathname === "/orders" && "text-blue-500"
          )}
        />
        <span
          className={twMerge(
            "text-xs text-slate-400",
            pathname === "/orders" && "text-blue-500"
          )}
        >
          Orders
        </span>
      </Link>
    </div>
  );
};