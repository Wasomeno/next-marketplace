"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { VscSignOut } from "react-icons/vsc"

import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/dropdown"

export function AdminMainMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const session = useSession()
  return (
    <Dropdown open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <div className="relative h-8 w-8 rounded-full bg-slate-300 lg:h-10 lg:w-10" />
        </div>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent asChild side="bottom" align="end" sideOffset={2.5}>
            <motion.div
              initial={{ height: "50px", opacity: 0 }}
              animate={{ height: "150px", opacity: 1 }}
              exit={{ height: "50px", opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="z-30 w-64 rounded-md border border-slate-300 bg-white duration-200 dark:border-neutral-600 dark:bg-neutral-900"
              style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
            >
              <div className="border-b px-4 py-2 dark:border-b-neutral-800">
                <h5 className="font-sans text-sm font-medium lg:text-base">
                  Admin
                </h5>
                <span className="font-sans text-xs font-medium text-slate-500 lg:text-sm">
                  {session?.data?.user?.username}
                </span>
              </div>
              <div className="p-2 dark:border-b-neutral-800">
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200 hover:dark:bg-neutral-800"
                >
                  <span>
                    <VscSignOut size="16" />
                  </span>
                  <span className="text-xs lg:text-sm"> Sign Out</span>
                </button>
              </div>
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </Dropdown>
  )
}
