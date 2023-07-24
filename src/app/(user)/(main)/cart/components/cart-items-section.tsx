"use client";

import React, { useState } from "react";

import { CartItemWithProductPrice } from "../page";
import { CartCheckoutDialog } from "./cart-checkout-dialog";
import { CartItems } from "./cart-items";

export const CartItemsSection = ({ user }: { user: string }) => {
  const [selectedItems, setSelectedItems] = useState<
    Array<CartItemWithProductPrice>
  >([]);

  return (
    <div className="flex flex-1 flex-col items-start justify-between gap-10 lg:flex-row lg:justify-center">
      <CartItems
        userEmail={user as string}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <CartCheckoutDialog user={user as string} selectedItems={selectedItems} />
    </div>
  );
};
