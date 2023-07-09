import { Metadata } from "next";

import { prisma } from "@/lib/prisma";

import { CategoryProductsSection } from "./components/products-section";

type Props = {
  params: { category: string };
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

export default async function CategoryProductsPage(props: {
  params: { category: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: props.params.category },
  });

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between border-y bg-slate-50 px-16 lg:h-72 ">
        <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
          {category?.name}
        </h2>
        <div className="relative">{/* <Image /> */}</div>
      </div>
      <CategoryProductsSection category={props.params.category} />
    </div>
  );
}
