import React, { useState } from "react"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <>
        <textarea
          className={twMerge(
            clsx(
              "placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )
          )}
          {...props}
          ref={ref}
        />
        <span className="text-xs text-slate-300"></span>
      </>
    )
  }
)

TextArea.displayName = "TextArea"

export { TextArea }
