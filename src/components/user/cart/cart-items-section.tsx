"use client";

import { useState } from "react";

import { CartItem } from "@/app/(user)/(main)/cart/page";

import { CartCheckoutDialog } from "./cart-checkout-dialog";
import { CartItems } from "./cart-items";

export const CartItemsSection = () => {
  const [selectedItems, setSelectedItems] = useState<Array<CartItem>>([]);
  return (
    <div className="flex flex-1 flex-col items-start justify-between gap-10 lg:flex-row lg:justify-center">
      <CartItems
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <CartCheckoutDialog selectedItems={selectedItems} />
    </div>
  );
};
