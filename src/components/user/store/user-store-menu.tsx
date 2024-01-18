"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as HoverCard from "@radix-ui/react-hover-card"
import { AnimatePresence, motion } from "framer-motion"
import { Session } from "next-auth"
import { BsBox2Heart } from "react-icons/bs"
import { HiOutlineClipboard } from "react-icons/hi2"
import { VscSignOut } from "react-icons/vsc"

import { ThemeSwitcher } from "@/components/theme-switcher"

export const UserStoreMenu = ({ session }: { session: Session }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <HoverCard.Root
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      openDelay={0}
      closeDelay={0}
    >
      <HoverCard.Trigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <div className="flex h-[60px] w-[60px] items-center justify-center">
            <Image
              src={session?.user?.picture as string}
              alt="userProfile"
              className="rounded-full object-cover"
              width={35}
              height={35}
            />
          </div>
        </div>
      </HoverCard.Trigger>
      <AnimatePresence>
        {isOpen && (
          <HoverCard.Portal forceMount>
            <HoverCard.Content
              asChild
              side="bottom"
              align="end"
              sideOffset={2.5}
            >
              <motion.div
                initial={{ height: "0px", opacity: 0 }}
                animate={{ height: "210px", opacity: 1 }}
                exit={{ height: "0px", opacity: 0 }}
                transition={{ duration: 0.2, ease: "backIn" }}
                className="z-30 w-64 overflow-hidden rounded-md border border-slate-300 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-neutral-950"
                style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
              >
                <div className="border-b p-2.5 dark:border-b-gray-800">
                  <h5 className="font-sans font-medium">
                    {session?.user?.name}
                  </h5>
                  <span className="font-sans text-sm font-medium text-slate-500">
                    {session?.user?.email}
                  </span>
                </div>
                <div className="border-b p-1.5 dark:border-b-gray-800">
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-gray-100 hover:dark:bg-slate-800"
                  >
                    <span>
                      <BsBox2Heart size="16" />
                    </span>
                    <span className="text-sm">Wishlist</span>
                  </Link>
                </div>
                <div className="p-1.5">
                  <ThemeSwitcher />
                  <Link
                    href="/"
                    className="flex w-full items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-gray-100 hover:dark:bg-slate-800"
                  >
                    <span>
                      <VscSignOut size="16" />
                    </span>
                    <span className="text-sm"> Back to main page</span>
                  </Link>
                </div>
              </motion.div>
            </HoverCard.Content>
          </HoverCard.Portal>
        )}
      </AnimatePresence>
    </HoverCard.Root>
  )
}
