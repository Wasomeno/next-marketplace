import React, { ReactElement } from "react"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"
import { AnimatePresence, motion } from "framer-motion"

type Props = LinkProps & {
  text: string
  isOpen?: boolean
  icon?: ReactElement
  isMobile?: boolean
}

export const StoreSideNavigationLink = ({
  isOpen = true,
  icon,
  text,
  isMobile = false,
  ...props
}: Props) => {
  const pathname = usePathname()
  const isActive = pathname.includes(props.href as string)
  return (
    <Link {...props} className="w-full">
      <div
        className={clsx(
          "flex w-full flex-col items-center gap-2 overflow-hidden py-2.5 text-start transition-colors duration-200 hover:text-blue-500 lg:mx-6 lg:flex-row lg:gap-4",
          isActive ? "text-blue-500" : "text-gray-400"
        )}
      >
        {icon}
        <AnimatePresence>
          {!isMobile && isOpen ? (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: "fit-content",
                opacity: 1,
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ ease: "easeIn", velocity: 0, delay: 0, damping: 0 }}
              className="overflow-hidden text-xs font-medium lg:text-sm"
            >
              {text}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </Link>
  )
}
