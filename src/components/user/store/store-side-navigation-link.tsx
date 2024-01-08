import React, { ReactElement } from "react"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"

type Props = LinkProps & {
  text: string
  isOpen?: boolean
  icon?: ReactElement
}

export const StoreSideNavigationLink = ({
  isOpen,
  icon,
  text,
  ...props
}: Props) => {
  const pathname = usePathname()
  const isActive = pathname.includes(props.href as string)
  return (
    <Link {...props} className="w-full">
      <div
        className={clsx(
          "mx-6 flex w-full items-center gap-4 overflow-hidden py-2.5 text-start transition-colors duration-200 hover:text-blue-500",
          isActive ? "text-blue-500" : "text-gray-400"
        )}
      >
        {icon}
        {isOpen && <span className="text-sm font-medium">{text}</span>}
      </div>
    </Link>
  )
}
