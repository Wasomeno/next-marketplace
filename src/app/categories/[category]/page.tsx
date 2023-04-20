"use client";

import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

const Category = () => {
  const router = useRouter();
  const categoryProducts = [
    "Product 1",
    "Product 2",
    "Product 3",
    "Product 4",
    "Product 5",
    "Product 6",
  ];

  return (
    <main className="flex flex-col items-center gap-6 py-10">
      <div className="flex h-72 w-full items-center bg-slate-500 px-16 ">
        <h2 className="text-4xl font-medium text-slate-50">Category</h2>
      </div>
      <div className="w-5/6 p-4">
        <div className="relative flex justify-center gap-10">
          <div className="sticky top-0 h-96 w-1/6">
            <p className="mb-4 text-lg font-medium">Filters</p>
            <div className="h-full rounded-md border border-slate-400"></div>
          </div>
          <div className="w-5/6">
            <p className="mb-4 text-lg font-medium">Products</p>
            <div className="grid grid-cols-6 gap-4">
              {categoryProducts.map((product, index) => (
                <div
                  onClick={() => router.push("/categories/category/product")}
                  className="col-span-1 h-80 cursor-pointer rounded-md shadow-md"
                  key={index}
                >
                  <div className="mb-4 h-4/6 w-full bg-slate-200" />
                  <div className="flex w-full flex-col gap-2 px-4">
                    <span className="font-sans text-sm">{product}</span>
                    <span className="font-sans font-medium">Rp. 1000</span>
                    <span className="flex gap-1 font-sans text-sm">
                      <FaStar size="15" className="fill-yellow-400" />
                      <FaStar size="15" className="fill-yellow-400" />
                      <FaStar size="15" className="fill-yellow-400" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Category;
