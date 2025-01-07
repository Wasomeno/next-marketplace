import { Suspense } from "react"

import { TPageProps } from "../../../../../types"
import { StoreDetails, StoreDetailsSkeleton } from "./_components/store-details"
import { StoreProducts } from "./_components/store-products"

export default async function StorePage({ params }: TPageProps) {
  const { storeSlug } = await params
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 lg:px-24 lgs:py-6">
      <div className="space-y-4">
        <Suspense fallback={<StoreDetailsSkeleton />}>
          <div className="px-4">
            <StoreDetails slug={storeSlug} />
          </div>
        </Suspense>
        <StoreProducts />
      </div>
    </div>
  )
}
