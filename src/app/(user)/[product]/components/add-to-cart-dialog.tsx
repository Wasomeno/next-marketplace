"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query-client";
import { Product } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export interface AddToCartDialogProps {
  user: string;
  productDetails: Product;
}

export const AddToCartDialog = ({
  user,
  productDetails,
}: AddToCartDialogProps) => {
  const [amount, setAmount] = useState<number>(1);
  const router = useRouter();

  const addProductMutation = useMutation(async () =>
    toast.promise(addProductToCart(), {
      pending: "Adding " + productDetails.name,
      success: "Succesfully added " + productDetails.name,
      error: "Error",
    })
  );

  async function addProductToCart() {
    await fetch(`/api/users/${user}/cart`, {
      method: "POST",
      body: JSON.stringify({
        product: { id: productDetails.id, amount: amount },
      }),
    });
    queryClient.invalidateQueries(["cart", user]);
    queryClient.invalidateQueries(["cartItemCount", user]);
  }

  function increment() {
    if (amount >= productDetails.stock) return;
    setAmount((currentAmount) => currentAmount + 1);
  }

  function decrement() {
    if (amount <= 1) return;
    setAmount((currentAmount) => currentAmount - 1);
  }

  return (
    <div className="sticky bottom-0 w-full bg-white lg:w-3/12">
      <div className="border-t border-slate-400 p-2 lg:rounded-md lg:border lg:p-4">
        <div className="hidden lg:block">
          <span className="text-sm lg:text-base">Product Amount</span>
          <div className="my-4 flex items-center justify-center gap-4">
            <div className="relative flex w-3/6 items-center justify-center gap-4 rounded-md bg-slate-200 text-sm font-medium">
              <button onClick={decrement} className="h-6 w-6 lg:h-8 lg:w-8">
                -
              </button>
              <span>{amount}</span>
              <button onClick={increment} className="h-6 w-6 lg:h-8 lg:w-8">
                +
              </button>
            </div>
            <span className="w-3/6 text-end text-xs lg:text-sm">
              Stock: {productDetails.stock}
            </span>
          </div>
        </div>
        <div className="my-2 hidden justify-between lg:flex">
          <span className="text-xs text-slate-500 lg:text-base">Subtotal</span>
          <span className="text-sm lg:text-lg">
            Rp. {(amount * productDetails.price).toLocaleString("id")}
          </span>
        </div>
        <div className="flex w-full gap-2 lg:flex-col lg:gap-0">
          <Button
            variant="defaultOutline"
            className="my my-2 h-8 w-full rounded-lg border border-blue-400  text-xs font-medium text-blue-400 lg:h-10 lg:text-sm"
          >
            Add to Wishlist
          </Button>
          <Button
            variant="default"
            onClick={() =>
              user ? addProductMutation.mutate() : router.push("/login")
            }
            className="my my-2 h-8 w-full rounded-lg  bg-blue-400 text-xs font-medium text-slate-50 lg:h-10 lg:text-sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
