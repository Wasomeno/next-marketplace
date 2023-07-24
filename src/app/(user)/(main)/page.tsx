import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HomeBannerSlider } from "@/components/user/home-banner-slider";
import ProductCard from "@/components/user/product-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Next Martketplace | Shopping Made Easy with Next Marketplace",
  description: "The best place to shop for your daily needs",
};

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { images: { select: { image_url: true } } },
  });
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true, slug: true } },
      images: { select: { image_url: true } },
    },
    orderBy: { price: "desc" },
  });

  return (
    <div className="relative flex flex-col items-center justify-start gap-6 bg-white px-4 lg:px-8">
      <HomeBannerSlider />
      <div className="w-full lg:w-5/6">
        <div className="w-3/6 rounded-md border p-4 shadow-sm ">
          <h2 className="mb-4 font-sans text-sm font-medium lg:text-xl">
            Categories
          </h2>
          <div className="flex items-center justify-start gap-4 overflow-x-scroll">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={"/categories/" + category.slug}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative h-20 w-20 lg:h-24 lg:w-24">
                  <Image
                    src={category.images[0].image_url}
                    alt="category-image"
                    fill
                    className="rounded-md border-2 transition duration-200 hover:border-blue-300"
                    quality={30}
                  />
                </div>
                <span className="text-center text-xs">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-5/6">
        <h2 className="mb-4 text-start font-sans text-sm font-medium lg:text-xl">
          Top Products
        </h2>
        <div className="grid grid-cols-10 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              href={`/${product.id}`}
              image={<ProductCard.Image image={product.images[0].image_url} />}
              name={<ProductCard.Name name={product.name} />}
              price={<ProductCard.Price price={product.price} />}
              category={<ProductCard.Category category={product.category} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
