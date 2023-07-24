"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

import { CartItemWithProductPrice } from "../page";

interface CartCheckoutDialogProps {
  user: string;
  selectedItems: CartItemWithProductPrice[];
}

export const CartCheckoutDialog = ({
  user,
  selectedItems,
}: CartCheckoutDialogProps) => {
  const total = selectedItems
    .reduce(
      (firstValue, item) => item.amount * item.product.price + firstValue,
      0
    )
    .toLocaleString("id");

  const checkout = useMutation(
    async () =>
      await axios.post(`/api/users/${user}/orders`, {
        total,
        products: selectedItems.map((item) => ({ id: item.product_id })),
      }),
    {
      onSuccess(response: any) {
        toast.success(response.message);
        redirect("/orders");
      },
    }
  );

  return (
    <div className="sticky bottom-0 w-full lg:w-2/6 lg:px-8">
      <div className="border-t border-slate-400 p-2.5 lg:rounded-md lg:border lg:p-4">
        <span className="hidden text-xs lg:inline lg:text-lg">
          Cart Summary
        </span>
        <div className="my-2 flex justify-between">
          <span className="text-xs text-slate-500 lg:text-base">Subtotal</span>
          <span className="text-sm lg:text-lg">Rp {total}</span>
        </div>
        <Button
          variant="default"
          onClick={() => checkout.mutate()}
          className="my-1 w-full rounded-lg border bg-blue-400  py-3 text-xs font-medium text-slate-50 lg:text-sm"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
