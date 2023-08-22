"use client"

import React from "react"
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { IconType } from "react-icons"
import { twMerge } from "tailwind-merge"

export interface Menu {
  text: string
  onSelect: () => void
  Icon: IconType
}

const Dropdown = DropdownPrimitive.Root
const DropdownPortal = DropdownPrimitive.Portal

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Content>,
  React.ComponentPropsWithRef<typeof DropdownPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownPortal forceMount>
      <DropdownPrimitive.Content
        className={twMerge(clsx(className))}
        ref={ref}
        {...props}
      >
        {children}
      </DropdownPrimitive.Content>
    </DropdownPortal>
  )
})

DropdownContent.displayName = "DropdownContent"

const DropdownTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownPrimitive.Trigger ref={ref} className={className} {...props}>
      {children}
    </DropdownPrimitive.Trigger>
  )
})

DropdownTrigger.displayName = "DropdownTrigger"

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ children, className, ...props }, ref) => {
  return (
    <DropdownPrimitive.Item className={className} ref={ref} {...props}>
      {children}
    </DropdownPrimitive.Item>
  )
})

DropdownItem.displayName = "DropdownItem"

export {
  Dropdown,
  DropdownContent,
  DropdownPortal,
  DropdownTrigger,
  DropdownItem,
}
