"use client";

import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsBox2Heart } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { VscSignOut } from "react-icons/vsc";

import { ThemeSwitcher } from "@/components/theme-switcher";

import { UserSession } from "./user-menu-main";

export function UserMenuMobile({ session }: { session: UserSession | null }) {
  const [showMenu, setShowMenu] = useState(false);
  const pathnamae = usePathname();

  useEffect(() => {
    setShowMenu(false);
  }, [pathnamae]);

  return (
    <div className="relative flex items-center md:hidden">
      <button onClick={() => setShowMenu(true)}>
        <HiMenu size="20" />
      </button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-x-0 z-30 h-screen w-screen rounded-t-lg bg-white dark:bg-slate-950 py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
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
              <div className="flex items-center gap-4 border-b dark:border-b-gray-700 px-4 py-2">
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
              <div className="space-y-1.5 border-b dark:border-b-gray-700 px-4 py-2">
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
  );
}
