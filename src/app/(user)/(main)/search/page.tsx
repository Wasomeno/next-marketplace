import { Metadata } from "next";

import { ProductsSection } from "@/components/products-section";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: { q: string; pmin: string; pmax: string; sort: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: `Product Search`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const priceMin = searchParams.pmin;
  const priceMax = searchParams.pmax;
  const sort = searchParams.sort ? [searchParams.sort.split(".")] : [];

  const products = await prisma.product.findMany({
    where: {
      name: { contains: searchParams.q },
      price: {
        lte: priceMax ? parseInt(priceMax as string) : 5000000,
        gte: priceMin ? parseInt(priceMin as string) : 100,
      },
    },
    orderBy: !sort.length ? { price: "asc" } : Object.fromEntries(sort as []),

    include: { category: true, images: true },
  });
  return <ProductsSection products={products} />;
}
