"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { BsBox2Heart } from "react-icons/bs"
import { HiMenu, HiX } from "react-icons/hi"
import { IoSettingsOutline } from "react-icons/io5"
import { VscSignOut } from "react-icons/vsc"

import { ThemeSwitcher } from "@/components/theme-switcher"

export function UserMobileMenu({ session }: { session: Session }) {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  return (
    <div className="relative flex items-center md:hidden">
      <button onClick={() => setShowMenu(true)}>
        <HiMenu size="20" />
      </button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-x-0 z-30 h-screen w-screen rounded-t-lg bg-white py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-neutral-950"
            initial={{ top: "100vh" }}
            animate={{ top: "0" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: "easeInOut",
            }}
            exit={{ top: "100vh" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "tween",
                delay: 0.3,
                duration: 0.2,
                ease: "easeInOut",
              }}
              exit={{ opacity: 0 }}
            >
              <div className="flex h-8 items-center gap-4 px-4">
                <button onClick={() => setShowMenu(false)}>
                  <HiX size="18" />
                </button>
                <span className="text-sm font-medium">Menu</span>
              </div>
              <div className="flex items-center gap-4 border-b px-4 py-2 dark:border-b-gray-800">
                <div className="relative h-10 w-10">
                  <Image
                    fill
                    src={session?.user?.picture as string}
                    className="rounded-full"
                    alt="user-image"
                  />
                </div>
                <div>
                  <h5 className="font-sans font-medium">
                    {session?.user?.name}
                  </h5>
                  <span className="font-sans text-sm font-medium text-slate-500">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 border-b px-4 py-2 dark:border-b-gray-800">
                <button
                  onClick={() => {
                    router.push("/wishlist")
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200"
                >
                  <span>
                    <BsBox2Heart size="16" />
                  </span>
                  <span className="text-sm">Wishlist</span>
                </button>
                <button
                  onClick={() => {
                    router.push("/wishlist")
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200"
                >
                  <span>
                    <IoSettingsOutline size="16" />
                  </span>
                  <span className="text-sm">Settings</span>
                </button>
              </div>
              <div className="px-4 py-2">
                <ThemeSwitcher />
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
