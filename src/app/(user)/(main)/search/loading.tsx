import { ProductSorterSkeleton } from "@/components/product-sorter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/user/product-card";

export default async function SearchLoading() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="relative flex w-full justify-center gap-10 px-4 lg:px-10">
        <div className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <h6 className="text-sm font-medium lg:text-lg">Products</h6>
            <div className="flex items-center gap-2">
              <ProductSorterSkeleton />
              <Button
                disabled
                variant="defaultOutline"
                className="border-slate-200 dark:border-gray-700"
              >
                Filter
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-4">
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
