import React from "react"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={twMerge(
          clsx(
            "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-gray-400 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:focus-visible:outline-none",
            className
          )
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
