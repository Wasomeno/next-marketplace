"use client"

import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { BsArrowLeft } from "react-icons/bs"

import { Button } from "../../ui/button"

type BackButtonProps = {
  size?: string | number
  text?: string
}

export const MainNavigationBackButton = ({
  size,
}: Readonly<BackButtonProps>) => {
  const { back } = useRouter()
  const pathName = usePathname()
  const pathNameLength = pathName.split("/").length
  return (
    <Button
      onClick={back}
      className={clsx(
        "flex gap-2 bg-transparent p-3 lg:hidden",
        pathNameLength === 2 && "hidden"
      )}
    >
      <BsArrowLeft size={size ?? 16} />
    </Button>
  )
}
