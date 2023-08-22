import { UrlObject } from "url"
import React, { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { HiDotsVertical } from "react-icons/hi"

import { Button } from "./ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./ui/dropdown"

export function TableRowMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dropdown onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger className="outline-none ring-0" asChild>
        <button className="mx-auto flex h-8 w-8 items-center justify-center">
          <HiDotsVertical className="h-[14px] w-[14px] fill-slate-600 dark:fill-slate-50 lg:h-4 lg:w-4" />
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent asChild>
            <motion.div
              initial={{ height: "10px", opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "10px", opacity: 0 }}
              className="flex w-40 flex-col overflow-hidden rounded-md border bg-white text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {children}
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </Dropdown>
  )
}

const MenuButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ onClick, children, ...props }, ref) => (
  <DropdownItem asChild>
    <Button
      ref={ref}
      onClick={onClick}
      className="px-3 py-2 text-start outline-0 ring-0 transition duration-200 hover:bg-slate-100 hover:dark:bg-neutral-800"
      {...props}
    >
      {children}
    </Button>
  </DropdownItem>
))

MenuButton.displayName = "MenuButton"

const MenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & { href: string | UrlObject }
>(({ href, children, ...props }, ref) => (
  <DropdownItem asChild>
    <Link
      ref={ref}
      href={href}
      className="px-3 py-2 text-start outline-0 ring-0 transition duration-200 hover:bg-slate-100 hover:dark:bg-neutral-800"
      {...props}
    >
      {children}
    </Link>
  </DropdownItem>
))

MenuLink.displayName = "MenuLink"

TableRowMenu.Link = MenuLink
TableRowMenu.Button = MenuButton
