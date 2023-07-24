import ProductCard from "@/components/user/product-card";

export default function HomeLoading() {
  return (
    <div className="relative flex flex-col items-center justify-start gap-6 bg-white px-4 lg:px-8">
      <div className="swiper-container relative h-40 w-full animate-pulse rounded-lg bg-slate-200 lg:h-80 lg:w-5/6" />
      <div className="w-full rounded-md border p-4 shadow-sm lg:w-5/6">
        <h2 className="mb-4 font-sans text-sm font-medium lg:text-xl">
          Categories
        </h2>
        <div className="flex items-center justify-start gap-4 overflow-x-scroll">
          {["test", "test", "test", "test"].map((category, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="relative h-20 w-20 animate-pulse rounded-lg bg-slate-200  lg:h-24 lg:w-24" />
              <div className="h-3 w-20 animate-pulse rounded-lg bg-slate-200 lg:h-5" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-5/6">
        <h2 className="mb-4 text-start font-sans text-sm font-medium lg:text-xl">
          Top Products
        </h2>
        <div className="grid grid-cols-10 gap-4">
          {["test", "test", "test", "test"].map((product, index) => (
            <ProductCard.Skeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
