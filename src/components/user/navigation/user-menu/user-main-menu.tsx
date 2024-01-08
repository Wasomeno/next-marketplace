"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as HoverCard from "@radix-ui/react-hover-card"
import { AnimatePresence, motion } from "framer-motion"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { BsBox2Heart } from "react-icons/bs"
import { HiOutlineClipboard } from "react-icons/hi"
import { VscSignOut } from "react-icons/vsc"

import { ThemeSwitcher } from "@/components/theme-switcher"

export const UserMainMenu = ({ session }: { session: Session }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <HoverCard.Root
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      openDelay={0}
      closeDelay={0}
    >
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
                animate={{ height: "240px", opacity: 1 }}
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
                    href="/orders"
                    className="flex items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-gray-100 hover:dark:bg-slate-800"
                  >
                    <span>
                      <HiOutlineClipboard size="16" />
                    </span>
                    <span className="text-sm">Orders</span>
                  </Link>
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
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-gray-100 hover:dark:bg-slate-800"
                  >
                    <span>
                      <VscSignOut size="16" />
                    </span>
                    <span className="text-sm"> Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </HoverCard.Content>
          </HoverCard.Portal>
        )}
      </AnimatePresence>
    </HoverCard.Root>
  )
}
