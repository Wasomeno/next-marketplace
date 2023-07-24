import axios from "axios";
import Image from "next/image";
import { BiTrash } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query-client";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useMutation } from "@tanstack/react-query";

import { CartItemWithProductImage } from "../page";

interface CartItemCardProps {
  user: string;
  isSelected: boolean;
  itemDetails: CartItemWithProductImage;
  onClick: () => void;
}

export const CartItemCard = ({
  user,
  itemDetails,
  isSelected,
  onClick,
}: CartItemCardProps) => {
  const deleteCartItem = useMutation(async () => {
    await axios.post(`/api/users/${user}/cart/${itemDetails.id}/delete`);
    queryClient.invalidateQueries(["cart", user]);
    queryClient.invalidateQueries(["cartItemCount", user]);
  });

  const updateCartItem = useMutation(
    async ({ item, amount }: { item: number; amount: number }) =>
      await axios.patch(`/api/users/${user}/cart/${item}`, {
        amount: amount,
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(["cart", user]);
      },
    }
  );

  async function increment(stock: number, item: number, amount: number) {
    if (amount >= stock) return;
    updateCartItem.mutate({ item, amount: amount + 1 });
  }

  async function decrement(item: number, amount: number) {
    if (amount <= 1) return;
    updateCartItem.mutate({ item, amount: amount - 1 });
  }

  return (
    <div
      key={itemDetails.id}
      className="flex items-center justify-start gap-2.5"
    >
      <Checkbox.Root
        checked={isSelected}
        onClick={() => onClick()}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-400 bg-slate-50"
      >
        <Checkbox.Indicator color="black">
          <BsCheck size="15" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <div
        className="w-full space-y-2 rounded-lg border p-4 shadow-sm"
        key={itemDetails.id}
      >
        <div className="flex w-full items-center gap-4 ">
          <div className="w-[60px] lg:w-[120px]">
            <div className="relative h-16 w-full rounded-md bg-slate-200 lg:h-32">
              <Image
                src={itemDetails.product.images[0].image_url}
                alt="product-image"
                fill
              />
            </div>
          </div>
          <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
            <span className="text-xs font-medium tracking-wide lg:text-base">
              {itemDetails.product.name}
            </span>
            <span className="text-xs lg:text-base">
              Rp {itemDetails.product.price.toLocaleString("id")}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div className="flex h-7 w-20 items-center justify-center gap-4 rounded-md bg-slate-200 text-sm font-medium lg:h-10 lg:w-20">
            <button
              onClick={() => decrement(itemDetails.id, itemDetails.amount)}
            >
              -
            </button>
            <span className="text-xs lg:text-sm">{itemDetails.amount}</span>
            <button
              onClick={() =>
                increment(
                  itemDetails.product.stock,
                  itemDetails.id,
                  itemDetails.amount
                )
              }
            >
              +
            </button>
          </div>
          <Button
            onClick={() => deleteCartItem.mutate()}
            variant="danger"
            size="sm"
            className="text-white"
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CartItemCardSkeleton = () => {
  return (
    <div className="flex items-center justify-start gap-2.5">
      <div className="flex h-6 w-6 animate-pulse rounded-md bg-slate-300" />
      <div className="w-full space-y-2 rounded-lg border p-4 shadow-sm">
        <div className="flex w-full items-center gap-4 ">
          <div className="w-[60px] lg:w-[120px]">
            <div className="h-16 w-full animate-pulse rounded-md bg-slate-300 lg:h-32" />
          </div>
          <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
            <div className="h-6 w-40 animate-pulse rounded-md bg-slate-300 lg:h-8 lg:w-52  " />
            <div className="h-6 w-24 animate-pulse rounded-md bg-slate-300 lg:h-8 lg:w-32  " />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <div className="flex h-7 w-20  animate-pulse rounded-md bg-slate-300 lg:h-10 lg:w-20" />
        </div>
      </div>
    </div>
  );
};
