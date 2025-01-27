import { Metadata } from "next"

import { TPageProps } from "../../../../../types"
import { SearchProductResults } from "./_components/search-result-products"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product Search`,
  }
}

export default async function SearchPage({ searchParams }: TPageProps) {
  const { q } = await searchParams
  const title = q ? `You search for "${q}"` : "Discover Products"
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between bg-slate-100 px-10 dark:bg-neutral-900 lg:h-72 lg:px-28">
        <h1 className="text-lg font-medium lg:text-4xl">{title}</h1>
      </div>
      <SearchProductResults />
    </div>
  )
}
