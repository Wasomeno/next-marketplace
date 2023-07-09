"use client";

import { ISODateString, Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
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
          <div className="relative h-7 w-7">
            <Image
              src={session?.user?.picture as string}
              alt="userProfile"
              fill={true}
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-sm tracking-wide">
            {session?.user?.name?.split(" ")[0]}
          </span>
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-30 flex h-52 w-52 flex-col gap-2 rounded-md border bg-white p-2 transition-all duration-200"
          sideOffset={20}
          align={"end"}
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        >
          <Link
            href="/orders"
            className="flex items-center justify-between rounded-md px-4 py-3 text-sm transition duration-200 hover:bg-slate-200"
          >
            <span>
              <HiOutlineClipboard size="18" />
            </span>
            <span className="text-center">Orders</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center justify-between rounded-md  px-4 py-3 text-sm transition duration-200 hover:bg-slate-200"
          >
            <span>
              <VscSignOut size="18" />
            </span>
            <span> Sign Out</span>
          </button>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
