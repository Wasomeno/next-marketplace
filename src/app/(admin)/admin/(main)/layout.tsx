import AdminNavigation from "@/components/admin/admin-navigation"
import { AdminNavigationMobile } from "@/components/admin/admin-navigation-mobile"
import { AdminToolbar } from "@/components/admin/admin-toolbar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminMainLayout({ children }: AdminLayoutProps) {
  return (
    <main className="bg-white dark:bg-neutral-900 lg:flex lg:justify-center">
      <AdminNavigation />
      <div className="flex min-h-screen flex-1 flex-col items-center">
        <AdminToolbar />
        {children}
        <AdminNavigationMobile />
      </div>
    </main>
  )
}
