"use client"

import React from "react"
import { BiStore } from "react-icons/bi"
import {
  HiListBullet,
  HiOutlineArchiveBox,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineHome,
} from "react-icons/hi2"

import { StoreSideNavigationLink } from "./store-side-navigation-link"

export const StoreMobileNavigation = () => {
  return (
    <div className="sticky bottom-0 left-0 flex items-center gap-2 border-t border-gray-200 bg-white shadow-md lg:hidden">
      <StoreSideNavigationLink
        text="Home"
        href="/store/home"
        icon={<HiOutlineHome size={20} />}
      />
      <StoreSideNavigationLink
        text="Products"
        href="/store/products"
        icon={<HiOutlineArchiveBox size={20} />}
      />
      <StoreSideNavigationLink
        text="Orders"
        href="/store/orders"
        icon={<HiListBullet size={20} />}
      />
      <StoreSideNavigationLink
        text="Profile"
        href="/store/profile"
        icon={<BiStore size={20} />}
      />
      <StoreSideNavigationLink
        text="Reviews"
        href="/store/reviews"
        icon={<HiOutlineChatBubbleLeftEllipsis size={20} />}
      />
    </div>
  )
}
