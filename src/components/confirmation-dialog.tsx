import React from "react"

import { Button } from "./ui/button"
import { Dialog, DialogContent } from "./ui/dialog"

type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: () => void
  onConfirm: () => void
  onCancel: () => void
  title: string
  body: string
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  body,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent open={open} className="lg:h-2/6 lg:w-2/6">
        <div className="flex h-full flex-col items-center justify-between">
          <div className="flex h-5/6 flex-col justify-center gap-2.5 text-center">
            <h5 className="text-base font-medium lg:text-lg ">{title}</h5>
            <p className="text-sm lg:text-base">{body}</p>
          </div>
          <div className="flex h-20 w-3/6 items-center justify-evenly">
            <Button
              variant="success"
              onClick={onConfirm}
              className="w-20 rounded-lg border py-2.5 text-sm font-medium text-white"
            >
              Confirm
            </Button>
            <Button
              variant="danger"
              onClick={onCancel}
              className="w-20 rounded-lg border py-2.5 text-sm font-medium text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
