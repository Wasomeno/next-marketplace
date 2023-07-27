import { Metadata } from "next";
import invariant from "tiny-invariant";

import { AddToCartDialog } from "@/components/user/product-details/add-to-cart-dialog";
import { ProductImages } from "@/components/user/product-details/product-images";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { product: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(params?.product) },
  });

  return {
    title: `${productDetails?.name} | Next Marketplace `,
    description: productDetails?.description,
  };
}

export default async function ProductPage(props: {
  params: { product: string };
}) {
  const { product: productId } = props.params;
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { images: { select: { image_url: true } } },
  });

  invariant(productDetails, "Type error");

  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full flex-wrap justify-center gap-10 lg:w-5/6 lg:flex-nowrap">
        <ProductImages
          imageUrls={productDetails?.images.map((image) => image.image_url)}
        />
        <div className="w-10/12 lg:w-5/12">
          <h1 className="text-base font-medium lg:text-xl">
            {productDetails?.name}
          </h1>
          <div className="my-4 text-lg font-medium lg:text-3xl">
            Rp. {productDetails?.price.toLocaleString("id")}
          </div>
          <hr className="my-2 w-full bg-slate-200" style={{ height: "1px" }} />
          <span className="text-sm font-medium lg:text-base">Description</span>
          <hr className="my-2 w-full bg-slate-200" style={{ height: "1px" }} />
          <div>
            <p className="text-sm font-light lg:text-base">
              {productDetails?.description}
            </p>
          </div>
        </div>
        <AddToCartDialog productDetails={productDetails} />
      </div>
    </div>
  );
}
