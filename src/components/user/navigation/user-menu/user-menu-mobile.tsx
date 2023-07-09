"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import { UserSession } from "./user-menu-main";

export function UserMenuMobile({ session }: { session: UserSession | null }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="relative flex items-center md:hidden">
      <button onClick={() => setShowMenu(true)}>
        <HiMenu size="20" />
      </button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-x-0 z-30 h-screen w-screen rounded-t-lg bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
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
              className="flex flex-col gap-6"
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
              <div className="flex h-8 items-center gap-4">
                <button onClick={() => setShowMenu(false)}>
                  <HiX size="18" />
                </button>
                <span className="text-base">Menu</span>
              </div>
              <div className="flex items-center">
                <div className="item-center flex w-2/6 justify-center">
                  <div className="relative h-16 w-16">
                    <Image
                      src={session?.user?.picture as string}
                      alt="user-image"
                      fill
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h6>{session?.user?.name}</h6>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <h5 className="text-base font-medium">My Activity</h5>
                <div className="space-y-1.5">
                  <div></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
