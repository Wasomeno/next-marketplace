import ProductCard from "@/components/user/product-card";

export default async function SearchLoading() {
  const products = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="relative flex w-full justify-center gap-10 px-4 lg:w-11/12">
        <div className="sticky lg:w-[240px]">
          <h5 className="mb-4 text-sm font-medium lg:text-lg">Filters</h5>
          <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-4">
            <div className="space-y-2">
              <h6 className="font-medium tracking-wide">Price</h6>
              <div className="space-y-1">
                <input
                  type="number"
                  className="rounded-lg border bg-slate-100 p-1.5 text-sm"
                />
                <input
                  type="number"
                  className="rounded-lg border bg-slate-100 p-1.5 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-9/12">
          <p className="mb-4 text-sm font-medium lg:text-lg">Products</p>
          <div className="grid grid-cols-9 gap-4">
            {products?.map((product) => (
              <ProductCard.Skeleton key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
