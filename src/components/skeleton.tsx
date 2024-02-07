import React, { HTMLAttributes } from "react"
import clsx from "clsx"
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
          "relative isolate overflow-hidden rounded-lg  bg-gray-300 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent",
          className
        )
      )}
    />
  )
}
