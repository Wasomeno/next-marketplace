interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-4 bg-white lg:gap-6">
      {children}
    </div>
  );
}
