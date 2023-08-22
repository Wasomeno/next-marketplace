"use client"

import { motion } from "framer-motion"

export function PageTransitionWrapper({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
