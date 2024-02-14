import Link from "next/link";
import { ReactNode } from "react";
import { BiArrowBack } from "react-icons/bi";

import { UserMainNavigation } from "@/components/user/navigation/user-main-navigation";
import { UserSettingsTabs } from "@/components/user/navigation/user-settings-tabs";

interface UserSettingsLayout {
  children: ReactNode
}

export default async function UserSettingsLayout(props: UserSettingsLayout) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white lg:gap-6  dark:bg-neutral-950">
      <UserMainNavigation />
      <div className="flex flex-1 flex-col px-5 pb-2.5 lg:px-8">
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 lg:hidden"
          >
            <BiArrowBack size={18} />
          </Link>
          <h1 className="text-base font-medium lg:text-xl">Settings</h1>
        </div>
        <UserSettingsTabs />
        {props.children}
      </div>
    </div>
  )
}
