import { Metadata } from "next"
import { SearchResultProducts } from "@/modules/user/search-page/components/search-result-products"

type Props = {
  searchParams: {
    q: string
    pmin: string
    pmax: string
    sort: string
    category: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product Search`,
  }
}

export default async function SearchPage({ searchParams }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between bg-slate-100 px-10 dark:bg-neutral-900 lg:h-72 lg:px-16 ">
        <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
          You Search for {`"${searchParams.q}"`}
        </h2>
      </div>
      <SearchResultProducts />
    </div>
  )
}
