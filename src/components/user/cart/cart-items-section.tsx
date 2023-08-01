"use client";

import { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import invariant from "tiny-invariant";

import { CartItem } from "@/app/(user)/(main)/cart/page";
import { Prisma } from "@prisma/client";

import { CartCheckoutDialog } from "./cart-checkout-dialog";
import { CartItemCard } from "./cart-item-card";

export const CartItemsSection = ({
  items,
}: {
  items:
    | Prisma.CartItemGetPayload<{
        include: { product: { include: { images: true } } };
      }>[]
    | undefined;
}) => {
  const [selectedItems, setSelectedItems] = useState<Array<CartItem>>([]);

  function selectCartItem(cartItem: CartItem) {
    setSelectedItems((items) => [...items, cartItem]);
  }

  function deselectCartItem(cartItemId: number) {
    setSelectedItems((items) =>
      items?.filter((selectedItem) => cartItemId !== selectedItem.id)
    );
  }

  invariant(items);

  return (
    <div className="flex flex-1 flex-col items-start justify-between lg:flex-row lg:justify-center">
      <div className="w-full px-5 lg:w-4/6 lg:px-8">
        <div className="flex w-full flex-col gap-4">
          {items.length > 0 &&
            items.map((item) => (
              <CartItemCard
                key={item.id}
                itemDetails={item}
                isSelected={selectedItems?.some(
                  (selectedItem) => selectedItem.id === item.id
                )}
                onClick={() =>
                  selectedItems?.some(
                    (selectedItem) => selectedItem.id === item.id
                  )
                    ? deselectCartItem(item.id)
                    : selectCartItem(item)
                }
              />
            ))}
          {items.length === 0 && (
            <div className="flex h-96 flex-col items-center justify-center gap-2.5">
              <span className="opacity-50">No items in Cart</span>
              <RxCrossCircled size="25" className="opacity-50" />
            </div>
          )}
        </div>
      </div>
      <CartCheckoutDialog selectedItems={selectedItems} />
    </div>
  );
};
