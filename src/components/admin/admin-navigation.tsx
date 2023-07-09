"use client";

import clsx from "clsx";
import Image from "next/image";
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

const AdminNavigation = () => {
  const { width } = useViewport();
  const path = usePathname();

  if (width < 768) return null;
  return (
    <div className="sticky left-0 top-0 h-screen w-64 border-r bg-white">
      <div className="flex h-20 items-center justify-center gap-2">
        <Image src="/next.svg" width={90} height={40} alt="shop-logo" />
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4 flex w-5/6 flex-col gap-2">
          <NavigationLink
            path={path}
            href="/admin"
            Icon={MdSpaceDashboard}
            title="Dashboard"
          />
          <NavigationLink
            path={path}
            href="/admin/categories"
            Icon={MdGridView}
            title="Categories"
          />
          <NavigationLink
            path={path}
            href="/admin/products"
            Icon={MdOutlineTableChart}
            title="Products"
          />
          <NavigationLink
            path={path}
            href="/admin/orders"
            Icon={MdOutlineRequestQuote}
            title="Orders"
          />
        </div>
      </div>
    </div>
  );
};

interface NavigationLinkProps {
  path: string | null;
  href: string;
  title: string;
  Icon: IconType;
}

const NavigationLink = ({ href, path, title, Icon }: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className={twMerge(
        clsx(
          "flex items-center gap-4 rounded-md p-4 transition duration-300",
          path === href && "bg-blue-100"
        )
      )}
    >
      <Icon
        size="25"
        className={twMerge(
          clsx(path !== href ? "fill-slate-400" : "fill-blue-500")
        )}
      />
      <h5
        className={twMerge(
          clsx(
            "text-sm font-semibold",
            path !== href ? "text-slate-400" : "text-blue-500"
          )
        )}
      >
        {title}
      </h5>
    </Link>
  );
};

export default AdminNavigation;
