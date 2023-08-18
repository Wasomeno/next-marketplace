import Image from "next/image"
import Link from "next/link"
import { Order, OrderStatus, Prisma } from "@prisma/client"

type ProductWithImage = Prisma.ProductGetPayload<{ include: { images: true } }>

interface OrderCardProps {
  transactionDetails: Order & {
    products: ProductWithImage[]
    status: OrderStatus
  }
}

export const OrderCard = ({ transactionDetails }: OrderCardProps) => {
  const date = new Date(transactionDetails.created_at)
  return (
    <Link
      href={`/orders?id=${transactionDetails.id}&&view=true`}
      className="flex flex-col gap-2 rounded-md border bg-slate-50 bg-opacity-50 px-4 py-2.5 shadow-sm dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50 dark:shadow-gray-800 lg:h-36"
    >
      <div className="flex items-center gap-3 lg:h-10">
        <div className="text-xs">{date.toDateString()}</div>
        <span className="rounded-md bg-blue-200 p-1.5 text-xs font-medium tracking-wide dark:bg-blue-900">
          {transactionDetails.status.name}
        </span>
        <div className="hidden text-xs lg:block">
          {transactionDetails.invoice}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:gap-10">
        <div className="flex w-full items-center gap-2.5 border-r-slate-200 dark:border-r-gray-800 lg:w-4/6 lg:border-r">
          {transactionDetails.products.map((product) => (
            <div
              key={product.id}
              className="relative h-16 w-16 overflow-hidden rounded-md border dark:border-gray-800 lg:h-20 lg:w-20"
            >
              <Image
                src={product.images[0].image_url}
                alt="product-image"
                fill
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h5 className="text-xs font-medium lg:text-sm">Total</h5>
          <span className="text-xs lg:text-base">
            Rp. {transactionDetails.total.toLocaleString("id")}
          </span>
        </div>
      </div>
    </Link>
  )
}

export const OrderCardSkeleton = () => {
  return (
    <div className="flex h-40 flex-col gap-2 rounded-md border bg-slate-50 bg-opacity-50 p-2.5 shadow-md dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50">
      <div className="flex h-10 items-center gap-3">
        <div className="h-6 w-24 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        <div>
          <div className="h-6 w-28 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        </div>
        <div className="h-6 w-32 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
      </div>
      <div className="flex items-center gap-10">
        <div className="flex w-4/6 items-center gap-2.5 border-r border-r-slate-300 dark:border-r-gray-800">
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-10 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
          <div className="h-6 w-7 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        </div>
      </div>
    </div>
  )
}
