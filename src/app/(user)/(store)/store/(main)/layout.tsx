import React, { ReactNode } from "react"
import invariant from "tiny-invariant"

import { StoreSideNavigation } from "@/components/user/store/store-side-navigation"
import { StoreTopNavigation } from "@/components/user/store/store-top-navigation"
import { getStore } from "@/app/actions/store"

export default async function StoreLayout({
  children,
}: {
  children: ReactNode
}) {
  const store = await getStore()

  invariant(store)

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-neutral-950">
      <StoreTopNavigation />
      <div className="flex flex-1">
        <StoreSideNavigation store={store} />
        <div className="flex flex-1 flex-col p-6">{children}</div>
      </div>
    </div>
  )
}
