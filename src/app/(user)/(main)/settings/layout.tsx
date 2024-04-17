import { ReactNode } from "react"
import Link from "next/link"
import { UserMainNavigation } from "@/modules/user/common/components/navigation/user-main-navigation/user-main-navigation"
import { UserSettingTabs } from "@/modules/user/common/components/navigation/user-setting-tabs"
import { BiArrowBack } from "react-icons/bi"

interface UserSettingsLayout {
  children: ReactNode
}

export default async function UserSettingsLayout(props: UserSettingsLayout) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-white dark:bg-neutral-950  lg:gap-6">
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
        <UserSettingTabs />
        {props.children}
      </div>
    </div>
  )
}
