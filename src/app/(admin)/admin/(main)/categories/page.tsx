import { Metadata } from "next"
import { AddCategoryModal } from "@/modules/admin/category-page/components/add-category-modal"
import { CategoryTable } from "@/modules/admin/category-page/components/category-table"
import { EditCategoryModal } from "@/modules/admin/category-page/components/edit-category-modal"

export const metadata: Metadata = {
  title: "Categories",
}

export default function CategoriesPages() {
  return (
    <div className="flex w-full flex-1 flex-col gap-2 p-4 dark:bg-neutral-900 lg:gap-4 lg:p-6">
      <h1 className="text-base font-medium lg:text-2xl">Categories</h1>
      <CategoryTable />
      <AddCategoryModal />
      <EditCategoryModal />
    </div>
  )
}
