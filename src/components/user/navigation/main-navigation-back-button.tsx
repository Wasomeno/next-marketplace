"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { BsArrowLeft } from "react-icons/bs"

type BackButtonProps = {
  size?: string | number
  text?: string
}

export const MainNavigationBackButton = ({
  size,
}: Readonly<BackButtonProps>) => {
  const { back } = useRouter()
  const pathName = usePathname()
  const params = useParams()

  const active =
    pathName.includes("cart") ||
    pathName.includes("wishlist") ||
    params.productId

  return (
    <button
      onClick={back}
      className={clsx(
        "flex items-center justify-center lg:hidden",
        !active && "hidden"
      )}
    >
      <BsArrowLeft size={size ?? 16} />
    </button>
  )
}
