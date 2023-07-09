"use client";

import axios from "axios";
import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

import { ProductWithImages } from "@/app/(admin)/admin/products/components/products-table";
import ProductCard from "@/components/user/product-card";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import {
  ProductSort,
  ProductSorter,
} from "../../../[product]/components/product-sorter";
import { CategoryProductsFilter } from "./product-filter";

export const CategoryProductsSection = ({ category }: { category: string }) => {
  const [priceFilter, setPriceFilter] = useState({ min: 10000, max: 50000000 });
  const [productSort, setProductSort] = useState<ProductSort>({
    id: 1,
    text: "Price low to high",
    sort: { price: "asc" },
  });

  const categoryProducts = useQuery(
    ["products", category, priceFilter.min, priceFilter.max, productSort],
    async () => await getProducts()
  );

  async function getProducts(): Promise<
    Category & {
      products: ProductWithImages[];
    }
  > {
    const products = await axios.post(`/api/categories/${category}/products`, {
      productSort,
      priceFilter,
    });
    return products.data;
  }
  return (
    <div className="relative flex w-full justify-center gap-10 px-4 lg:w-11/12">
      <CategoryProductsFilter setPriceFilter={setPriceFilter} />
      <div className="w-full lg:w-9/12">
        <div className="mb-4 flex items-center justify-between">
          <h6 className="mb-4 text-sm font-medium lg:text-lg">Products</h6>
          <ProductSorter
            productSort={productSort}
            setProductSort={setProductSort}
          />
        </div>
        <div className="grid grid-cols-8 gap-4">
          {categoryProducts.isLoading &&
            ["dummy", "dummy", "dummy", "dummy", "dummy"].map(
              (dummy, index) => <ProductCard.Skeleton key={index} />
            )}
          {!categoryProducts.isLoading &&
          categoryProducts.data?.products.length ? (
            categoryProducts.data.products.map((product) => (
              <ProductCard
                key={product.id}
                href={`/${product.id}`}
                image={
                  <ProductCard.Image image={product.images[0].image_url} />
                }
                name={<ProductCard.Name name={product.name} />}
                price={<ProductCard.Price price={product.price} />}
                category={<ProductCard.Category category={product.category} />}
              />
            ))
          ) : !categoryProducts.isLoading &&
            !categoryProducts.data?.products.length ? (
            <div className="col-span-10 flex h-96 flex-col items-center justify-center gap-2">
              <span className="text-slate-800 text-opacity-50">
                No products found
              </span>
              <span className="text-slate-800 text-opacity-50">
                <RxCrossCircled className="h-8 w-8" />
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
