import { CategoryTable } from "@/components/admin/category/category-table"
import AddCategoryModal from "@/components/admin/category/modals/add-category-modal"
import CategoryDetailsModal from "@/components/admin/category/modals/category-details-modal"
import CategoryEditModal from "@/components/admin/category/modals/category-edit-modal"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { getAllCategories } from "@/app/actions/categories"

export const metadata = {
  title: "Admin | Categories",
}
export default async function AdminCategoriesPages() {
  const categories = await getAllCategories()
  return (
    <PageTransitionWrapper className="flex w-full flex-1 flex-col bg-slate-50 p-5 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Categories
        </h1>
      </div>
      <CategoryTable categories={categories} />
      <AddCategoryModal />
      <CategoryDetailsModal />
      <CategoryEditModal />
    </PageTransitionWrapper>
  )
}
