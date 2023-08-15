import { Metadata } from "next";

import { ProductsSection } from "@/components/products-section";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { category: string };
  searchParams: { pmin: string; pmax: string; sort: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });
  return {
    title: `${category?.name} | Next Marketplace`,
    description: category?.description,
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: Props) {
  const priceMin = searchParams.pmin;
  const priceMax = searchParams.pmax;
  const sort = searchParams.sort ? [searchParams.sort.split(".")] : [];

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      products: {
        orderBy: !sort.length ? { price: "asc" } : Object.fromEntries(sort),
        where: {
          price: {
            lte: priceMax ? parseInt(priceMax) : 5000000,
            gte: priceMin ? parseInt(priceMin) : 100,
          },
        },
        include: { images: true, category: true },
      },
    },
  });

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between border-y bg-slate-50 dark:bg-slate-900 dark:border-y-gray-700 px-10 lg:h-72 lg:px-16 ">
        <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
          {category?.name}
        </h2>
      </div>
      <ProductsSection products={category?.products} />
    </div>
  );
}
