import { ReactNode } from "react"
import { UserMainNavigation } from "@/modules/user/common/components/navigation/user-main-navigation/user-main-navigation"
import { UserSettingSideNavigation } from "@/modules/user/common/components/navigation/user-setting-side-navigation"

interface UserSettingsLayout {
  children: ReactNode
}

export default async function UserSettingsLayout(props: UserSettingsLayout) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white dark:bg-neutral-950  lg:gap-6">
      <UserMainNavigation />
      <div className="flex flex-1 flex-col space-y-2 px-4 pb-4 pr-4 lg:pb-8">
        <h1 className="pl-0 text-base font-medium lg:pl-8 lg:text-xl">
          Settings
        </h1>
        <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:gap-8">
          <UserSettingSideNavigation />
          {props.children}
        </div>
      </div>
    </div>
  )
}
