"use client"

import * as React from "react"
import { useMediaQuery } from "@/utils/hooks"
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog"

interface BaseProps {
  children: React.ReactNode
}

interface ResponsiveDialogProps extends BaseProps {
  onOpenChange?: (open: boolean) => void
}

interface ResponsiveDialogProps extends BaseProps {
  open?: boolean
  className?: string
  asChild?: true
}

interface ResponsiveDialogHeaderProps {
  title: string
  description?: string
}

const desktop = "(min-width: 768px)"

const ResponsiveDialog = ({ children, ...props }: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialog = isDesktop ? Dialog : Drawer

  return <ResponsiveDialog {...props}>{children}</ResponsiveDialog>
}

const ResponsiveDialogTrigger = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialogTrigger = isDesktop ? DialogTrigger : DrawerTrigger

  return (
    <ResponsiveDialogTrigger className={className} {...props}>
      {children}
    </ResponsiveDialogTrigger>
  )
}

const ResponsiveDialogClose = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialogClose = isDesktop ? DialogClose : DrawerClose

  return (
    <ResponsiveDialogClose className={className} {...props}>
      {children}
    </ResponsiveDialogClose>
  )
}

const ResponsiveDialogContent = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialogContent = isDesktop ? DialogContent : DrawerContent

  return (
    <ResponsiveDialogContent className={className} open={true} {...props}>
      {children}
    </ResponsiveDialogContent>
  )
}

const ResponsiveDialogDescription = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialogDescription = isDesktop
    ? DialogDescription
    : DrawerDescription

  return (
    <ResponsiveDialogDescription className={className} {...props}>
      {children}
    </ResponsiveDialogDescription>
  )
}

const ResponsiveDialogHeader = ({ ...props }: ResponsiveDialogHeaderProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialogHeader = isDesktop ? DialogHeader : DrawerHeader

  return <ResponsiveDialogHeader {...props} />
}

const ResponsiveDialogTitle = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ResponsiveDialogTitle = isDesktop ? DialogTitle : DrawerTitle

  return (
    <ResponsiveDialogTitle className={className} {...props}>
      {children}
    </ResponsiveDialogTitle>
  )
}

const ResponsiveDialogBody = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  return (
    <div className={twMerge(clsx("px-4 md:px-0", className))} {...props}>
      {children}
    </div>
  )
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
}
