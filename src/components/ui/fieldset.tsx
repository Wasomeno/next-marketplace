import React, { HTMLAttributes, ReactElement, ReactNode } from "react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { FieldError, Merge } from "react-hook-form"
import { twMerge } from "tailwind-merge"

interface FieldsetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  error?: Merge<FieldError, (FieldError | undefined)[]>
  label: string
}

export const Fieldset: React.FC<FieldsetProps> = ({
  children,
  error,
  label,
  className,
  ...props
}) => {
  return (
    <div {...props} className={twMerge(clsx("flex flex-col gap-2", className))}>
      <label htmlFor={props.id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error?.message && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-600 dark:text-red-800"
          >
            {error.message}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
