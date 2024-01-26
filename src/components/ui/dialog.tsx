"use client"

import React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import clsx from "clsx"
import { motion } from "framer-motion"
import { RxCross2 } from "react-icons/rx"
import { twMerge } from "tailwind-merge"

const Dialog = DialogPrimitive.Root

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Trigger ref={ref} className={className} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  )
})

DialogTrigger.displayName = DialogPrimitive.Trigger.displayName

const DialogPortal = ({
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>
}

DialogPortal.displayName = DialogPrimitive.Portal.displayName

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay ref={ref} {...props} asChild={children === null}>
      {children ?? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.25 }}
          className={clsx(
            "fixed inset-0 z-30 bg-neutral-950 bg-opacity-30 backdrop-blur-[2px]",
            className
          )}
        />
      )}
    </DialogPrimitive.Overlay>
  )
})

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogHeader = ({ title }: { title: string }) => {
  return (
    <div className="sticky top-0 z-20 flex h-12 w-full shrink-0 items-center justify-between border-b bg-white px-6 lg:h-16 dark:border-b-neutral-700 dark:bg-neutral-900">
      <DialogPrimitive.Title className="text-base font-medium lg:text-lg">
        {title}
      </DialogPrimitive.Title>
      <DialogPrimitive.Close>
        <RxCross2 className="h-5 w-5" />
      </DialogPrimitive.Close>
    </div>
  )
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    open: boolean
  }
>(({ className, children, open, ...props }, ref) => {
  return (
    <DialogPrimitive.Content ref={ref} {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.25, delay: 0.1 }}
        className={twMerge(
          "fixed bottom-0 right-1/2 z-50 flex h-[95%] w-full flex-1 translate-x-1/2 flex-col overflow-y-scroll rounded-lg bg-white shadow-md transition duration-300 lg:top-1/2 lg:-translate-y-1/2 dark:bg-neutral-900",
          className
        )}
      >
        {children}
      </motion.div>
    </DialogPrimitive.Content>
  )
})

DialogContent.displayName = DialogPrimitive.Content.displayName

export {
  Dialog,
  DialogOverlay,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogPortal,
}
