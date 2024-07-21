"use client"

import { useRouter } from "next/navigation"
import clsx from "clsx"
import { BsArrowLeft } from "react-icons/bs"

type BackButtonProps = {
  size?: string | number
  text?: string
}

export const BackButton = ({ size }: Readonly<BackButtonProps>) => {
  const { back } = useRouter()

  return (
    <button
      onClick={back}
      className={clsx("flex items-center justify-center lg:hidden")}
    >
      <BsArrowLeft size={size ?? 16} />
    </button>
  )
}
