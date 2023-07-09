"use client";

import { useQuery } from "@tanstack/react-query";

export function CartItemCount({ user }: { user: string }) {
  const cartItemsAmount = useQuery(
    ["cartItemCount", user],
    async () => await getCartItemsCount()
  );

  async function getCartItemsCount() {
    return await fetch(`http://localhost:3000//api/users/${user}/cart/count`, {
      method: "GET",
    }).then((count) => count.json());
  }

  if (!cartItemsAmount.isLoading) {
    return (
      <div className="flex-items-center absolute -right-2.5 -top-2 flex h-5 w-5 justify-center rounded-full  border-2 border-white bg-red-600 text-xs font-semibold text-white lg:h-6 lg:w-6 lg:text-sm">
        {cartItemsAmount.data}
      </div>
    );
  } else {
    return <></>;
  }
}
