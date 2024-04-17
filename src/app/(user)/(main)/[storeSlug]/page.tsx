import { Suspense } from "react"
import {
  StoreDetails,
  StoreDetailsSkeleton,
} from "@/modules/user/store-page/components/store-details"
import { StoreProducts } from "@/modules/user/store-page/components/store-products"

export default async function StorePage({
  params,
}: {
  params: { storeSlug?: string }
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 lg:px-10 lg:py-6">
      <div className="space-y-4">
        <Suspense fallback={<StoreDetailsSkeleton />}>
          <StoreDetails slug={params?.storeSlug} />
        </Suspense>
        <StoreProducts />
      </div>
    </div>
  )
}
