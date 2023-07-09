"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import {
  MdGridView,
  MdOutlineRequestQuote,
  MdOutlineTableChart,
  MdSpaceDashboard,
} from "react-icons/md";
import { twMerge } from "tailwind-merge";

import { useViewport } from "../hooks/useViewport";

export const AdminNavigationMobile = () => {
  const { width } = useViewport();
  const path = usePathname();

  if (width > 468) return null;
  return (
    <div className="sticky bottom-2.5 flex w-11/12 items-center justify-center rounded-lg bg-white p-1.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <NavigationLink path={path} href="/admin" Icon={MdSpaceDashboard}>
        Dashboard
      </NavigationLink>
      <NavigationLink path={path} href="/admin/categories" Icon={MdGridView}>
        Categories
      </NavigationLink>
      <NavigationLink
        path={path}
        href="/admin/products"
        Icon={MdOutlineTableChart}
      >
        Products
      </NavigationLink>
      <NavigationLink
        path={path}
        href="/admin/orders"
        Icon={MdOutlineRequestQuote}
      >
        Orders
      </NavigationLink>
    </div>
  );
};

interface NavigationLinkProps {
  path: string | null;
  href: string;
  children: React.ReactNode;
  Icon: IconType;
}

const NavigationLink = ({
  href,
  path,
  children,
  Icon,
}: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className="flex w-32 flex-col items-center gap-1 rounded-md p-1.5 transition duration-300"
    >
      <Icon
        size="20"
        className={twMerge(
          clsx(path !== href ? "text-slate-400" : "text-blue-500")
        )}
      />
      <h5
        className={twMerge(
          clsx(
            "text-[10px] font-medium",
            path !== href ? "text-slate-400" : "text-blue-500"
          )
        )}
      >
        {children}
      </h5>
    </Link>
  );
};
