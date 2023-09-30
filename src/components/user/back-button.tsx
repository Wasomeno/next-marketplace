"use client"

import { useRouter } from "next/navigation"
import { BsArrowLeft } from "react-icons/bs"

type BackButtonProps = {
  size?: string | number
  text?: string
}

export const BackButton = ({ size }: Readonly<BackButtonProps>) => {
  const { back } = useRouter()
  return (
    <button onClick={back} className="flex gap-2 bg-transparent lg:hidden">
      <BsArrowLeft size={size ?? 18} />
    </button>
  )
}
