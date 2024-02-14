import React, { ReactNode } from "react"

export default async function CreateStoreLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 items-center justify-center">{children}</div>
  )
}
