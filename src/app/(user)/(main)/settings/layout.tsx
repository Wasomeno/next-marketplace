import { ReactNode } from "react"

import { UserMainNavigation } from "@/components/user/navigation/user-main-navigation"
import { UserMobileNavigation } from "@/components/user/navigation/user-mobile-navigation"
import { UserSettingsTabs } from "@/components/user/navigation/user-settings-tabs"

interface UserSettingsLayout {
  children: ReactNode
}

export default async function UserSettingsLayout(props: UserSettingsLayout) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white lg:gap-6  dark:bg-neutral-950">
      <UserMainNavigation />
      <div className="flex flex-1 flex-col px-5 pb-2.5 lg:px-8">
        <div className="mb-2">
          <h1 className="text-base font-medium lg:text-xl">Settings</h1>
        </div>
        <UserSettingsTabs />
        {props.children}
      </div>
      <UserMobileNavigation />
    </div>
  )
}
