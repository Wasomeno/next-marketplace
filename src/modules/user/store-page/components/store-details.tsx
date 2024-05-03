import Image from "next/image"
import { getStore } from "@/actions/store/store"
import { FiMapPin } from "react-icons/fi"

import { Skeleton } from "@/components/skeleton"

export async function StoreDetails({ slug }: { slug?: string }) {
  const store = await getStore({ slug })
  return (
    <div className="flex items-center rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-200 lg:h-28 lg:w-28">
          <Image
            src={store?.profile_image ?? "/"}
            alt="store-profile-image"
            fill
          />
        </div>
        <div className="space-y-2">
          <h2 className="font-medium">{store?.name}</h2>
          <div className="flex items-center gap-2 text-gray-500">
            <FiMapPin size={12} />
            <span className="text-sm ">{store?.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StoreDetailsSkeleton() {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full lg:h-28 lg:w-28" />
        <div className="space-y-2">
          <Skeleton className="h-[20px] w-32" />
          <div className="flex items-center gap-2 text-gray-500">
            <Skeleton className="h-[18px] w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
