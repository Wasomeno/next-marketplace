"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Store } from "@prisma/client"
import clsx from "clsx"
import { motion } from "framer-motion"
import {
  HiChevronRight,
  HiHome,
  HiListBullet,
  HiOutlineArchiveBox,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineHome,
} from "react-icons/hi2"

import { StoreSideNavigationLink } from "./store-side-navigation-link"

export const StoreSideNavigation = ({ store }: { store: Store }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ width: "70px" }}
      animate={{
        width: isOpen ? "256px" : "70px",
      }}
      transition={{ ease: "easeOut", duration: 0.3, velocity: 0.5 }}
      className="sticky left-0 top-0 flex flex-col gap-2 border-r border-r-gray-100 shadow-md"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-end border-b border-b-gray-200 px-5 py-3.5"
      >
        <HiChevronRight size={18} />
      </button>
      <div className={clsx("flex flex-col gap-4", !isOpen && "items-center")}>
        <div
          className={clsx(
            "flex items-center gap-4 overflow-hidden py-2",
            isOpen && "px-6"
          )}
        >
          <div className="h-8 w-8  rounded-full bg-slate-500" />
          {isOpen && (
            <div className="w-28 text-sm font-medium">{store?.name}</div>
          )}
        </div>
        <StoreSideNavigationLink
          text="Home"
          href="/store/home"
          icon={<HiOutlineHome size={20} />}
          isOpen={isOpen}
        />
        <StoreSideNavigationLink
          text="Products"
          href="/store/products"
          icon={<HiOutlineArchiveBox size={20} />}
          isOpen={isOpen}
        />
        <StoreSideNavigationLink
          text="Orders"
          href="/store/orders"
          icon={<HiListBullet size={20} />}
          isOpen={isOpen}
        />
        <StoreSideNavigationLink
          text="Details"
          href="/store/details"
          icon={<HiOutlineChatBubbleLeftEllipsis size={20} />}
          isOpen={isOpen}
        />
        <StoreSideNavigationLink
          text="Reviews"
          href="/store/reviews"
          icon={<HiOutlineChatBubbleLeftEllipsis size={20} />}
          isOpen={isOpen}
        />
      </div>
    </motion.div>
  )
}
