"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

import { CartItem } from "../../../app/(user)/(main)/cart/page";

interface CartCheckoutDialogProps {
  selectedItems: CartItem[];
}

export const CartCheckoutDialog = ({
  selectedItems,
}: CartCheckoutDialogProps) => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const total = selectedItems
    .reduce(
      (firstValue, item) => item.amount * item.product.price + firstValue,
      0
    )
    .toLocaleString("id");

  const checkout = useMutation(
    async () =>
      await axios.post(`/api/users/${userEmail}/orders`, {
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
      <div className="border-t lg:dark:border-gray-700 dark:border-t-gray-700 border-slate-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] lg:rounded-md lg:border lg:border-slate-400 lg:p-4 lg:shadow-none">
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
          className="my-1 w-full rounded-lg bg-blue-400  py-3 text-xs font-medium dark:bg-blue-900 lg:text-sm"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
