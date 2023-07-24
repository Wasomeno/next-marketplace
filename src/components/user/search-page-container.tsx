import { Category, Product } from "@prisma/client";

import ProductCard from "./product-card";

export const SearchPageContainer = ({
  products,
}: {
  products: (Product & {
    category: Category;
    images: { image_url: string }[];
  })[];
}) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="relative flex w-full justify-center gap-10 px-4 lg:w-11/12">
        <div className="w-full lg:w-9/12">
          <p className="mb-4 text-sm font-medium lg:text-lg">Products</p>
          <div className="grid grid-cols-9 gap-4">
            {products?.map((product) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
