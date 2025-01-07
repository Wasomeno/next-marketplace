import clsx from "clsx"
import React, { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        twMerge(
          "relative isolate overflow-hidden rounded-lg  bg-gray-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent",
          className
        )
      )}
    />
  )
}
