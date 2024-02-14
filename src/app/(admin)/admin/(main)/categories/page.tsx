import { CategoryTable } from "@/components/admin/category/category-table"
import { AddCategoryModal } from "@/components/admin/category/modals/add-category-modal"
import { EditCategoryModal } from "@/components/admin/category/modals/edit-category-modal"
import { ViewCategoryModal } from "@/components/admin/category/modals/view-category-modal"
import { getCategories } from "@/app/actions/categories"

type CategoriesPageProps = {
  searchParams: {
    sort?: string
    search?: string
  }
}

export const metadata = {
  title: "Admin | Categories",
}

export default async function CategoriesPages(props: CategoriesPageProps) {
  const { sort, search } = props.searchParams
  const sortCategories: Record<string, "asc" | "desc"> = sort
    ? {
        [sort.split(".")[0]]: sort.split(".")[1] as "asc" | "desc",
      }
    : { id: "asc" }

  const categories = await getCategories({ search, sort: sortCategories })

  return (
    <div className="flex w-full flex-1 flex-col bg-slate-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Categories
        </h1>
      </div>
      <CategoryTable categories={categories} />
      <AddCategoryModal />
      <EditCategoryModal />
      <ViewCategoryModal />
    </div>
  )
}
