import React, { ReactNode } from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { AnimatePresence } from "framer-motion"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "./ui/dialog"

type ConfirmationDialogProps = {
  title: string
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
  onCancel?: () => void
  body: ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  body,
  title,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogContent
              open={open}
              className="flex h-48 flex-col justify-between gap-2 p-6 lg:h-48 lg:w-[30rem]"
            >
              <div className="space-y-2">
                <h5 className="text-lg font-semibold">{title}</h5>
                <p className="text-sm">{body}</p>
              </div>
              <div className="flex w-full items-center justify-end gap-2">
                <Button size="sm" onClick={onConfirm} className="w-32 py-2.5">
                  Confirm
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="defaultOutline"
                    size="sm"
                    className="w-32 py-2.5"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
