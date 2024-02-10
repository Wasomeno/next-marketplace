import React, { forwardRef, RefAttributes } from "react"
import * as CheckBoxPrimitive from "@radix-ui/react-checkbox"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { BiCheck } from "react-icons/bi"
import { twMerge } from "tailwind-merge"

export const CheckBox = forwardRef<
  RefAttributes<HTMLButtonElement>,
  CheckBoxPrimitive.CheckboxProps
>(({ className, ...props }) => {
  return (
    <CheckBoxPrimitive.Root
      className={clsx(
        twMerge(
          "flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-transparent disabled:cursor-default disabled:bg-gray-100 disabled:bg-opacity-50",
          className
        )
      )}
      {...props}
    >
      <AnimatePresence>
        <CheckBoxPrimitive.Indicator asChild>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
          >
            <BiCheck size={16} />
          </motion.span>
        </CheckBoxPrimitive.Indicator>
      </AnimatePresence>
    </CheckBoxPrimitive.Root>
  )
})

CheckBox.displayName = "CheckBox"
