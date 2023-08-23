"use client"

import { useRouter } from "next/navigation"
import { BsArrowLeft } from "react-icons/bs"

import { PageTransitionWrapper } from "./page-transition-wrapper"
import { Button } from "./ui/button"

type BackButtonProps = {
  size?: string | number
  text?: string
}

export const BackButton = ({ size, text }: Readonly<BackButtonProps>) => {
  const { back } = useRouter()
  return (
    <Button onClick={back} className="flex gap-2 bg-transparent p-3 lg:hidden">
      <BsArrowLeft size={size ?? 16} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </Button>
  )
}
