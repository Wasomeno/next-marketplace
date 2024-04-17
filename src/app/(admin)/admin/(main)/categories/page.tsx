import { Metadata } from "next"
import { CategoryTable } from "@/modules/admin/category-page/components/category-table"

export const metadata: Metadata = {
  title: "Categories",
}

export default function CategoriesPages() {
  return (
    <div className="flex w-full flex-1 flex-col p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Categories
        </h1>
      </div>
      <CategoryTable />
    </div>
  )
}
