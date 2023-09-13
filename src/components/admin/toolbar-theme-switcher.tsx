"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { BsSun } from "react-icons/bs"
import { FaRegMoon } from "react-icons/fa"

export const ToolbarThemeSwitcher = () => {
  const [isMounted, setIsMounted] = useState<boolean>()
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    if (window) {
      setIsMounted(true)
    }
  }, [])

  if (!isMounted) return
  return (
    <button
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className="rounded-md px-2.5 py-2 transition duration-200"
    >
      {theme === "dark" && <FaRegMoon size={20} />}
      {theme === "light" && <BsSun size={20} />}
    </button>
  )
}
