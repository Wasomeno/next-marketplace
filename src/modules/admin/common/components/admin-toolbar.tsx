import { ThemeSwitcher } from "@/components/theme-switcher"

import { AdminMainMenu } from "./admin-main-menu"

export const AdminToolbar = () => {
  return (
    <div className="sticky top-0 z-10 flex w-full items-center justify-end  border-b bg-white px-5 py-2.5 dark:border-b-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-end gap-2.5">
        <div className="flex w-10 justify-center lg:w-12">
          <ThemeSwitcher />
        </div>
        <div className="flex h-10 w-10 items-center justify-center lg:h-12 lg:w-12">
          <AdminMainMenu />
        </div>
      </div>
    </div>
  )
}
