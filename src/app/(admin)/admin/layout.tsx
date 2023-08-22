interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-slate-50 dark:bg-neutral-900">
      {children}
    </div>
  )
}
