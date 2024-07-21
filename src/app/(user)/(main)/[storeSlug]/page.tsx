import { Suspense } from "react"

import { StoreDetails, StoreDetailsSkeleton } from "./_components/store-details"
import { StoreProducts } from "./_components/store-products"

export default async function StorePage({
  params,
}: {
  params: { storeSlug?: string }
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 lg:px-10 lgs:py-6">
      <div className="space-y-4">
        <Suspense fallback={<StoreDetailsSkeleton />}>
          <StoreDetails slug={params?.storeSlug} />
        </Suspense>
        <StoreProducts />
      </div>
    </div>
  )
}
