interface UserLayoutProps {
  children: React.ReactNode
}

export default async function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white dark:bg-neutral-950">
      {children}
    </div>
  )
}
