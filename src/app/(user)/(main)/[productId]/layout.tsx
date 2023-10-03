import { ReactNode } from "react"

import { Footer } from "@/components/user/footer"
import { UserMainNavigation } from "@/components/user/navigation/user-main-navigation"

export default async function ProductLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white dark:bg-neutral-950  lg:gap-6">
      <UserMainNavigation back />
      {children}
      <Footer />
    </div>
  )
}
