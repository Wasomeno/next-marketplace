"use client"

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

import * as DialogPrimitive from "@radix-ui/react-dialog";

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
            twMerge(
              "fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]",
              className
            )
          )}
        />
      )}
    </DialogPrimitive.Overlay>
  )
})

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogHeader = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  return (
    <div className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b bg-white px-4 dark:border-b-neutral-700 dark:bg-neutral-900 lg:h-[4.5rem] lg:px-6">
      <div className="grid flex-wrap">
        <DialogPrimitive.Title className="text-base font-medium lg:text-lg">
          {title}
        </DialogPrimitive.Title>
        {description && (
          <p className="text-xs text-gray-400 lg:text-sm">{description}</p>
        )}
      </div>
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
    <AnimatePresence>
      {open && (
        <DialogPortal forceMount>
          <DialogOverlay />
          <DialogPrimitive.Content asChild ref={ref} {...props}>
            <motion.div
              initial={{ bottom: "-40vh", opacity: 0 }}
              animate={{ bottom: 0, opacity: 1 }}
              exit={{ bottom: "-40vh", opacity: 0 }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.25,
              }}
              className={clsx(
                twMerge(
                  "fixed bottom-0 z-[70] flex h-[95%] w-full flex-1 flex-col overflow-y-scroll rounded-lg bg-white shadow-md transition duration-300 dark:bg-neutral-900 lg:right-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-1/2 ",
                  className
                )
              )}
            >
              {children}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPortal>
      )}
    </AnimatePresence>
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
