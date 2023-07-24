interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserAuthLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white lg:gap-6">
      {children}
    </div>
  );
}
