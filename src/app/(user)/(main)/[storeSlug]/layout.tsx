import { ReactNode } from "react"
import { Footer } from "@/modules/user/common/components/footer"
import { UserMainNavigation } from "@/modules/user/common/components/navigation/user-main-navigation/user-main-navigation"

export default async function StoreLayout({
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
