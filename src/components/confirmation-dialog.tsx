import React, { ReactNode } from "react";

import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent
} from "./responsive-dialog";
import { Button } from "./ui/button";

type ConfirmationDialogProps = {
  title: string
  open: boolean
  onOpenChange?: (isOpen: boolean) => void
  onConfirm?: () => void
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
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        open={open}
        className="flex h-auto flex-col justify-between gap-3 px-6 pb-6 lg:h-48 lg:w-[30rem] lg:p-6"
      >
        <div className="space-y-2">
          <h5 className="text-lg font-semibold">{title}</h5>
          <p className="text-sm">{body}</p>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <Button size="sm" onClick={onConfirm} className="w-32 py-2.5">
            Confirm
          </Button>
          <ResponsiveDialogClose asChild>
            <Button
              variant="defaultOutline"
              size="sm"
              className="w-32 py-2.5"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </ResponsiveDialogClose>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
