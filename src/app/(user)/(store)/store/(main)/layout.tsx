import React, { ReactNode } from "react"

import { StoreMobileNavigation } from "@/components/store-mobile-navigation"
import { StoreSideNavigation } from "@/components/store-side-navigation"
import { StoreTopNavigation } from "@/components/store-top-navigation"

export default async function StoreLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex max-h-screen flex-1 flex-col dark:bg-neutral-950">
      <StoreTopNavigation />
      <div className="flex flex-1 flex-col lg:flex-row">
        <StoreSideNavigation />
        <div className="flex flex-1 flex-col p-4 lg:p-6">{children}</div>
      </div>
      <StoreMobileNavigation />
    </div>
  )
}
