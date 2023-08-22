"use client"

import React from "react"
import { useTheme } from "next-themes"
import { BsSun } from "react-icons/bs"
import { FaRegMoon } from "react-icons/fa"

export const ToolbarThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme()
  return (
    <button
      onClick={() => {
        if (resolvedTheme === "dark") {
          setTheme("light")
        } else {
          setTheme("dark")
        }
      }}
      className="rounded-md px-2.5 py-2 transition duration-200"
    >
      {resolvedTheme === "light" ? (
        <BsSun size={20} />
      ) : (
        <FaRegMoon size={20} />
      )}
    </button>
  )
}
