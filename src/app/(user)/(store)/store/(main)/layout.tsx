import React, { ReactNode } from "react"

import { StoreMobileNavigation } from "@/components/user/store/store-mobile-navigation"
import { StoreSideNavigation } from "@/components/user/store/store-side-navigation"
import { StoreTopNavigation } from "@/components/user/store/store-top-navigation"
import { getStore } from "@/app/actions/store/store"

export default async function StoreLayout({
  children,
}: {
  children: ReactNode
}) {
  const store = await getStore()

  return (
    <div className="flex max-h-screen flex-1 flex-col dark:bg-neutral-950">
      <StoreTopNavigation />
      <div className="flex flex-1 flex-col lg:flex-row">
        <StoreSideNavigation store={store} />
        <div className="flex flex-1 flex-col p-4 lg:p-6">{children}</div>
      </div>
      <StoreMobileNavigation />
    </div>
  )
}
