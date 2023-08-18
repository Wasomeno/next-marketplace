import { Footer } from "@/components/user/footer"
import { UserMainNavigation } from "@/components/user/navigation/user-main-navigation"
import { UserMobileNavigation } from "@/components/user/navigation/user-mobile-navigation"

interface UserLayoutProps {
  children: React.ReactNode
}

export default async function UserMainLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-white dark:bg-neutral-950 lg:gap-6">
      <UserMainNavigation />
      {children}
      <Footer />
      <UserMobileNavigation />
    </div>
  )
}
