"use client"

import React from "react"
import { HTMLMotionProps, motion } from "framer-motion"

export const PageTransitionWrapper = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ children, className, initial, animate, exit, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ ease: "easeInOut", duration: 0.2 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
))

PageTransitionWrapper.displayName = "PageTransitionWrapper"
