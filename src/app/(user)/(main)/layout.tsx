import { Footer } from "@/components/user/footer";
import { NavigationMain } from "@/components/user/navigation/navigation-main";
import { NavigationMobile } from "@/components/user/navigation/navigation-mobile";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserMainLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white lg:gap-6">
      <NavigationMain />
      {children}
      <Footer />
      <NavigationMobile />
    </div>
  );
}
