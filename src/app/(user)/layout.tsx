import { NavigationMain } from "@/components/user/navigation/navigation-main";
import { NavigationMobile } from "@/components/user/navigation/navigation-mobile";
import { Footer } from "@/components/user/site-footer";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-4 bg-white lg:gap-6">
      <NavigationMain />
      {children}
      <Footer />
      <NavigationMobile />
    </div>
  );
}
