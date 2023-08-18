"use client"

import { Dispatch, SetStateAction, useTransition } from "react"
import Image from "next/image"
import { Prisma } from "@prisma/client"
import * as Checkbox from "@radix-ui/react-checkbox"
import { BiTrash } from "react-icons/bi"
import { BsCheck } from "react-icons/bs"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { removeProductFromWishlist } from "@/app/actions/wishlist"

export const WishListItemCard = ({
  setSelectedItems,
  item,
}: {
  setSelectedItems: Dispatch<SetStateAction<number[]>>
  item: Prisma.WishlistItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>
}) => {
  const [isPending, startTransition] = useTransition()
  return (
    <div className="flex items-center gap-4 border-t p-4 dark:border-t-gray-800">
      <Checkbox.Root
        onClick={() =>
          setSelectedItems((selectedItems) => {
            if (selectedItems.includes(item.product_id)) {
              return selectedItems.filter(
                (selectedItem) => selectedItem !== item.product_id
              )
            } else {
              return [...selectedItems, item.product_id]
            }
          })
        }
        className="flex h-[15px] w-[15px] items-center justify-center rounded-sm border border-slate-400 bg-slate-50 dark:border-gray-700 dark:bg-neutral-800 lg:h-5 lg:w-5"
      >
        <Checkbox.Indicator color="black">
          <BsCheck size="18" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <div className="flex w-full items-end justify-between">
        <div className="flex w-full gap-4">
          <div className="w-[60px] lg:w-[120px]">
            <div className="relative h-16 w-full rounded-md bg-slate-200 lg:h-32">
              <Image
                src={item.product.images[0].image_url}
                alt="product-image"
                fill
              />
            </div>
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <span className="text-sm tracking-wide lg:text-base">
              Rp {item.product.price.toLocaleString("id")}
            </span>
            <span className="text-xs tracking-wide text-slate-500 lg:text-base">
              {item.product.name}
            </span>
          </div>
        </div>
        <div>
          <Button
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white dark:bg-red-800 lg:h-8 lg:w-8"
            onClick={() =>
              startTransition(async () => {
                await removeProductFromWishlist(item.product.id, "/wishlist")
                toast.error(`Removed ${item.product.name} from wishlist`)
              })
            }
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const WishListItemCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 border-t p-4">
      <Checkbox.Root
        disabled
        className="flex h-[15px] w-[15px] items-center justify-center rounded-sm border border-slate-400 bg-slate-50 lg:h-5 lg:w-5"
      >
        <Checkbox.Indicator color="black">
          <BsCheck size="18" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <div className="flex w-full items-end justify-between">
        <div className="flex w-full gap-4">
          <div className="w-[60px] lg:w-[120px]">
            <div className="relative h-16 w-full animate-pulse rounded-md bg-slate-300 lg:h-32" />
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <div className="h-[0.75rem] w-32 animate-pulse rounded-md bg-slate-300 lg:h-[1rem]" />
            <div className="h-[0.75rem] w-40 animate-pulse rounded-md bg-slate-300 lg:h-[1rem]" />
          </div>
        </div>
        <div>
          <Button
            disabled
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white lg:h-8 lg:w-8"
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  )
}
