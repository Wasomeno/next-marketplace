import React from "react"

import { Button } from "./ui/button"
import { Dialog, DialogContent } from "./ui/dialog"

type ConfirmationDialogProps = {
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
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        open={open}
        className="flex h-fit flex-col justify-between lg:w-96"
      >
        <div className="border-b border-gray-300 px-4 py-2">
          <span className="font-medium">Are you sure ?</span>
        </div>
        <div className="p-4">
          <p>{body}</p>
        </div>
        <div className="flex w-full items-center justify-evenly gap-2 px-4 pb-2">
          <Button
            variant="success"
            size="sm"
            onClick={onConfirm}
            className="w-full rounded-lg border py-2.5 text-xs font-medium text-white"
          >
            Confirm
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onCancel}
            className="w-full rounded-lg border py-2.5 text-xs font-medium text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
