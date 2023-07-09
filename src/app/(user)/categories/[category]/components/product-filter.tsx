import React, { Dispatch, SetStateAction } from "react";

interface CategoryProductsFilterProp {
  setPriceFilter: Dispatch<SetStateAction<{ min: number; max: number }>>;
}

export const CategoryProductsFilter = ({
  setPriceFilter,
}: CategoryProductsFilterProp) => {
  return (
    <div className="sticky top-0 hidden lg:block lg:w-3/12">
      <h5 className="mb-4 text-sm font-medium lg:text-lg">Filters</h5>
      <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-4">
        <div className="space-y-2">
          <h6 className="font-medium tracking-wide">Price</h6>
          <div className="space-y-1">
            <input
              type="number"
              className="rounded-lg border bg-slate-100 p-1.5 text-sm"
              placeholder="Min Price"
              onChange={(event) =>
                setTimeout(
                  () =>
                    setPriceFilter((current) => ({
                      ...current,
                      min: !event.target.value
                        ? 10000
                        : parseInt(event.target.value),
                    })),
                  450
                )
              }
            />
            <input
              type="number"
              className="rounded-lg border bg-slate-100 p-1.5 text-sm"
              placeholder="Max Price"
              onChange={(event) =>
                setTimeout(
                  () =>
                    setPriceFilter((current) => ({
                      ...current,
                      max: !event.target.value
                        ? 50000000
                        : parseInt(event.target.value),
                    })),
                  450
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryProductsFilterSkeleton = () => {
  return (
    <div className="sticky top-0 hidden lg:block lg:w-3/12">
      <h5 className="mb-4 text-sm font-medium lg:text-lg">Filters</h5>
      <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-4">
        <div className="space-y-2">
          <h6 className="font-medium tracking-wide">Price</h6>
          <div className="space-y-1">
            <input
              disabled
              type="number"
              className="rounded-lg border bg-slate-100 p-1.5 text-sm"
              placeholder="Min Price"
            />
            <input
              disabled
              type="number"
              className="rounded-lg border bg-slate-100 p-1.5 text-sm"
              placeholder="Max Price"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
