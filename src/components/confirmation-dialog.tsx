import React from "react"
import { AnimatePresence } from "framer-motion"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "./ui/dialog"

type ConfirmationDialogProps = {
  title: string
  open: boolean
  onOpenChange: () => void
  onConfirm: () => void
  onCancel: () => void
  body: string
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
                <Button
                  size="sm"
                  onClick={onConfirm}
                  className="w-32 rounded-lg py-2.5 text-xs font-medium"
                >
                  Confirm
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onCancel}
                  className="w-32 rounded-lg border py-2.5 text-xs font-medium text-white"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
