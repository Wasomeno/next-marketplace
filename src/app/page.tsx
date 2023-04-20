import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function Home() {
  const categories = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];

  const products = [
    "Product 1",
    "Product 2",
    "Product 3",
    "Product 4",
    "Product 5",
    "Product 6",
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-6 p-10">
      <div className="h-72 w-5/6 rounded-md bg-slate-300" />
      <div className="h-72 w-5/6 rounded-md bg-slate-50 p-4 drop-shadow-md">
        <h2 className="mb-4 font-sans text-xl font-medium">Categories</h2>
        <div className="flex items-center justify-start gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href="/categories/category"
              className="flex h-40 w-40 items-center justify-center rounded-md border border-slate-300"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
      <div className="w-5/6">
        <h2 className="mb-4 text-start font-sans text-xl font-medium">
          Selected Products
        </h2>
        <div className="grid grid-cols-7 gap-4">
          {products.map((product, index) => (
            <div className="col-span-1 h-80 rounded-md shadow-md" key={index}>
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
    </main>
  );
}
