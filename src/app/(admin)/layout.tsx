import { utapi } from "uploadthing/server";

import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import AdminNavigation from "@/components/admin/admin-navigation";
import { AdminNavigationMobile } from "@/components/admin/admin-navigation-mobile";
import { AdminToolbar } from "@/components/admin/admin-toolbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLayoutWrapper>
      <AdminNavigation />
      <div className="flex min-h-screen flex-1 flex-col items-center">
        <AdminToolbar />
        {children}
        <AdminNavigationMobile />
      </div>
    </AdminLayoutWrapper>
  );
}
