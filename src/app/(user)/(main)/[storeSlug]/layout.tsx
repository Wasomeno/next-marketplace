import { ReactNode } from "react"

import { Footer } from "@/components/user/footer"
import { UserMainNavigation } from "@/components/user/navigation/user-main-navigation"

export default async function StoreLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white lg:gap-6  dark:bg-neutral-950">
      <UserMainNavigation back />
      {children}
      <Footer />
    </div>
  )
}
