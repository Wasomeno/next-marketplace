import { AdminMobileNavigation } from "@/modules/admin/common/components/admin-mobile-navigation"
import AdminNavigation from "@/modules/admin/common/components/admin-navigation"
import { AdminToolbar } from "@/modules/admin/common/components/admin-toolbar"

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
        <AdminMobileNavigation />
      </div>
    </main>
  )
}
