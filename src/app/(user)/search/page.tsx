import { Metadata } from "next";

import { SearchPageContainer } from "@/components/user/search-page-container";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: `Product Search`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const products = await prisma.product.findMany({
    where: { name: { contains: searchParams.q } },
    include: { category: true, images: { select: { image_url: true } } },
  });
  return <SearchPageContainer products={products} />;
}
