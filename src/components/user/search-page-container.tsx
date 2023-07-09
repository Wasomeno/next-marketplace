"use client";

import { useState } from "react";

import { Category, Product, ProductImage } from "@prisma/client";

import ProductCard from "./product-card";

export const SearchPageContainer = ({
  products,
}: {
  products: (Product & {
    category: Category;
    images: { image_url: string }[];
  })[];
}) => {
  const [priceFilter, setPriceFilter] = useState({
    min: 10000,
    max: 50000000,
  });

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
                  placeholder="Min Price"
                  onChange={(event) =>
                    setTimeout(
                      () =>
                        setPriceFilter((current) => ({
                          ...current,
                          min: parseInt(event.target.value),
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
                          max: parseInt(event.target.value),
                        })),
                      450
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-9/12">
          <p className="mb-4 text-sm font-medium lg:text-lg">Products</p>
          <div className="grid grid-cols-9 gap-4">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                href={"/categories/" + product.category.slug + "/" + product.id}
                image={
                  <ProductCard.Image image={product.images[0].image_url} />
                }
                name={<ProductCard.Name name={product.name} />}
                price={<ProductCard.Price price={product.price} />}
                category={<ProductCard.Category category={product.category} />}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
