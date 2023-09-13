"use client"

import React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
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
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => {
  return (
    <DialogPrimitive.Portal className="fixed z-50" {...props}>
      {children}
    </DialogPrimitive.Portal>
  )
}

DialogPortal.displayName = DialogPrimitive.Portal.displayName

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay ref={ref} {...props}>
      {children}
    </DialogPrimitive.Overlay>
  )
})

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogHeader = ({ title }: { title: string }) => {
  return (
    <div className="sticky top-0 z-20 mb-4 flex h-12 w-full items-center justify-between border-b bg-slate-50 px-6 dark:border-b-neutral-700 dark:bg-neutral-900 lg:h-16">
      <DialogPrimitive.Title className="text-base font-medium lg:text-lg">
        {title}
      </DialogPrimitive.Title>
      <DialogPrimitive.Close>
        <RxCross2 size="20" />
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
          <DialogOverlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className="fixed inset-0 z-30 bg-neutral-950 bg-opacity-30 backdrop-blur-[2px]"
            />
          </DialogOverlay>
          <DialogPrimitive.Content asChild ref={ref} {...props}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.25, delay: 0.1 }}
              className={twMerge(
                "fixed bottom-0 right-1/2 z-50 h-[95%] w-full translate-x-1/2 overflow-y-scroll rounded-lg bg-slate-50 shadow-md transition duration-300 dark:bg-neutral-900 lg:top-1/2 lg:-translate-y-1/2",
                className
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

export { Dialog, DialogOverlay, DialogHeader, DialogContent, DialogTrigger }
