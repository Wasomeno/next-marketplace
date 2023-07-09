import ProductCard from "@/components/user/product-card";

import { ProductSorterSkeleton } from "../../[product]/components/product-sorter";
import { CategoryProductsFilterSkeleton } from "./components/product-filter";

export default function CategoryLoading() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between border-y bg-slate-50 px-16 lg:h-72 ">
        <div className="h-14 w-72 animate-pulse rounded-md bg-slate-200" />
      </div>
      <div className="relative flex w-full justify-center gap-10 px-4 lg:w-11/12">
        <CategoryProductsFilterSkeleton />
        <div className="w-full lg:w-9/12">
          <div className="mb-4 flex items-center justify-between">
            <h6 className="mb-4 text-sm font-medium lg:text-lg">Products</h6>
            <ProductSorterSkeleton />
          </div>
          <div className="grid grid-cols-8 gap-4">
            {["dummy", "dummy", "dummy", "dummy", "dummy"].map(
              (dummy, index) => (
                <ProductCard.Skeleton key={index} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
