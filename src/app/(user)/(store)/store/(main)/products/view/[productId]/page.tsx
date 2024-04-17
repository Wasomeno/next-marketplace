import { Metadata } from "next"
import { getProduct } from "@/actions/product"
import { ProductImages } from "@/modules/user/product-page/components/product-images"
import { ProductSalesMonthlyChart } from "@/modules/user/store/product-page/components/store-product-sales-charts/monthly"
import { BiCheck } from "react-icons/bi"
import invariant from "tiny-invariant"

type ProductPageProps = {
  params: { productId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(parseInt(params.productId))
  return {
    title: `${product?.name} | Store Product Page`,
    description: `Details about product ${product?.name}`,
  }
}

export default async function UserStoreProductViewPage({
  params,
}: ProductPageProps) {
  const product = await getProduct(parseInt(params.productId))
  const imageUrls = product?.images.map((image) => image.url)

  invariant(imageUrls)

  return (
    <div className="w-full space-y-4 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-medium lg:text-2xl">{product?.name}</h1>
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600">
            <BiCheck color="white" />
          </div>
          Published
        </button>
      </div>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <div className="w-96 px-4 lg:p-0">
          <ProductImages imageUrls={imageUrls} />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-4/6">
          <div className="col-span- flex flex-col gap-2 rounded-lg ">
            <span className="text-sm font-medium text-gray-400">Name</span>
            <span className="w-full">{product?.name}</span>
          </div>
          <div className="col-span-1 flex flex-col gap-2 rounded-lg  ">
            <span className="text-sm font-medium text-gray-400">
              Categories
            </span>
            <div className="flex items-center gap-2">
              {product?.categories.map((category) => (
                <span
                  key={category.id}
                  className="flex w-fit items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span- flex flex-col gap-2 rounded-lg  ">
            <span className="text-sm font-medium text-gray-400">Price</span>
            <span className="w-full">Rp. {product?.price}</span>
          </div>
          <div className="col-span-1 flex flex-col gap-2 rounded-lg  ">
            <span className="text-sm font-medium text-gray-400">Stock</span>
            <span className="w-full">{product?.stock}</span>
          </div>
          <div className="col-span-2 flex flex-col gap-2 rounded-lg  ">
            <span className="text-sm font-medium text-gray-400">
              Description
            </span>
            <p className="text-sm">{product?.description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Sales</h2>
        <div className="flex items-center gap-4">
          <ProductSalesMonthlyChart />
        </div>
      </div>
    </div>
  )
}
