"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { BsBell, BsSun } from "react-icons/bs";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../ui/dropdown";

export const AdminToolbar = () => {
  return (
    <div className="sticky flex w-full items-center justify-between  border-b bg-white px-5 py-2.5">
      <div className=""></div>
      <div className="flex items-center justify-end gap-2.5">
        <div className="flex w-10 justify-center lg:w-12">
          <BsBell className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        <div className="flex w-10 justify-center lg:w-12">
          <BsSun className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        <div className="flex h-10 w-10 items-center justify-center lg:h-12 lg:w-12">
          <Dropdown>
            <DropdownTrigger className="h-8 w-8 rounded-full bg-slate-200 lg:h-10 lg:w-10" />
            <DropdownContent className="w-40 rounded-md bg-white px-3 py-2.5 shadow-sm">
              <DropdownItem asChild>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="flex w-full items-center text-sm hover:ring-0"
                >
                  Logout
                </button>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
