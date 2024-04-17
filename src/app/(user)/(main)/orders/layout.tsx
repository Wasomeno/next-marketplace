import { ReactNode } from "react"
import { Footer } from "@/modules/user/common/components/footer"
import { UserMainNavigation } from "@/modules/user/common/components/navigation/user-main-navigation/user-main-navigation"
import { UserMobileNavigation } from "@/modules/user/common/components/navigation/user-mobile-navigation"

export default async function OrderLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white dark:bg-neutral-950  lg:gap-6">
      <UserMainNavigation />
      {children}
      <Footer />
      <UserMobileNavigation />
    </div>
  )
}
