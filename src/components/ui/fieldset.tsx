import React, { HTMLAttributes, ReactElement } from "react"
import clsx from "clsx"
import { Controller, FieldError } from "react-hook-form"
import { twMerge } from "tailwind-merge"

interface FieldsetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement
  error?: FieldError
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
      {error?.message && (
        <span className={"text-sm font-medium text-red-500"}>
          {error.message}
        </span>
      )}
    </div>
  )
}
