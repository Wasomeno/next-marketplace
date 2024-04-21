import React from "react";

import { ProductCountSkeleton } from "@/modules/user/store/product-page/components/product-count";
import { ProductTableSkeleton } from "@/modules/user/store/product-page/components/product-table";

const ProductLoadingPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
        <ProductCountSkeleton />
      </div>
      <ProductTableSkeleton />
    </div>
  )
}

export default ProductLoadingPage
