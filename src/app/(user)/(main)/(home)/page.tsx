import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/modules/user/common/components/product-card"
import { HomeBannerSlider } from "@/modules/user/home-page/components/home-banner-slider"

import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Shopping Made Easy with Next Marketplace",
  description: "The best place to shop for your daily needs",
}

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { images: { select: { url: true } } },
  })

  const products = await prisma.product.findMany({
    include: {
      images: { select: { url: true } },
      reviews: { select: { rating: true } },
      store: { select: { name: true, slug: true } },
    },
    orderBy: { price: "desc" },
  })

  return (
    <div className="relative flex flex-col items-center justify-start gap-6 bg-white px-4 dark:bg-neutral-950 lg:px-8">
      <HomeBannerSlider />
      <div className="w-full lg:w-11/12">
        <div className="w-full lg:w-3/6">
          <h2 className="mb-2 font-sans text-sm font-medium lg:mb-4 lg:text-xl">
            Categories
          </h2>
          <div className="flex items-center justify-start gap-6 overflow-x-scroll">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={"/categories/" + category.slug}
                className="flex flex-col items-center gap-2 transition-all duration-200"
              >
                <div className="relative h-[72px] w-[72px] overflow-hidden rounded-md lg:h-24 lg:w-24">
                  <Image
                    src={category.images[0].url}
                    alt="category-image"
                    fill
                    quality={30}
                  />
                </div>
                <span className="text-center text-xs tracking-wide lg:text-sm">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-11/12">
        <h2 className="mb-4 text-start font-sans text-sm font-medium lg:text-xl">
          Top Products
        </h2>
        <div className="grid grid-cols-10 gap-2.5 lg:grid-cols-12 lg:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              href={`/${product.store.slug}/${product.slug}`}
              image={<ProductCard.Image image={product.featured_image_url} />}
              name={<ProductCard.Name name={product.name} />}
              price={<ProductCard.Price price={product.price} />}
              store={<ProductCard.Store name={product.store.name} />}
              rating={
                <ProductCard.Rating
                  rating={
                    product.reviews.reduce(
                      (current, next) => (current += next.rating),
                      0
                    ) / product.reviews.length
                  }
                  reviewCount={product.reviews.length}
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
