"use client";

import { ISODateString } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineClipboard } from "react-icons/hi";
import { VscSignOut } from "react-icons/vsc";

import * as HoverCard from "@radix-ui/react-hover-card";

export interface UserSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    picture?: string | null;
  };
  expires: ISODateString;
}

export const UserMenuMain = ({ session }: { session: UserSession | null }) => {
  return (
    <HoverCard.Root openDelay={100} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <div className="hidden cursor-pointer items-center gap-2 md:flex">
          <div className="relative h-8 w-8">
            <Image
              src={session?.user?.picture as string}
              alt="userProfile"
              className="rounded-full object-cover"
              fill
            />
          </div>
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="end"
          sideOffset={2.5}
          className="z-30 w-64 rounded-md border border-slate-300 bg-white transition-all duration-200"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        >
          <div className="border-b px-2.5 py-2">
            <h5 className="font-sans font-medium">{session?.user?.name}</h5>
            <span className="font-sans text-sm font-medium text-slate-500">
              {session?.user?.email}
            </span>
          </div>
          <div className="border-b p-1.5">
            <Link
              href="/orders"
              className="flex items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200"
            >
              <span>
                <HiOutlineClipboard size="16" />
              </span>
              <span className="text-sm">Orders</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200"
            >
              <span>
                <BsBox2Heart size="16" />
              </span>
              <span className="text-sm">Wishlist</span>
            </Link>
          </div>
          <div className="p-1.5">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200"
            >
              <span>
                <VscSignOut size="16" />
              </span>
              <span className="text-sm"> Sign Out</span>
            </button>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
