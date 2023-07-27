import axios from "axios";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";

import { CartItem } from "@/app/(user)/(main)/cart/page";
import { useQuery } from "@tanstack/react-query";

import { CartItemCard, CartItemCardSkeleton } from "./cart-item-card";

async function fetchCartItems(
  user: string | null | undefined
): Promise<CartItem[]> {
  const cart = await axios.get(`/api/users/${user}/cart`);
  return cart.data;
}

function generateSkeleton(length: number) {
  let skeletons = [];
  for (let i = 0; i < length; i++) {
    skeletons.push(<CartItemCardSkeleton />);
  }
  return skeletons.map((skeleton) => skeleton);
}

interface CartItemsProps {
  selectedItems: CartItem[];
  setSelectedItems: Dispatch<SetStateAction<CartItem[]>>;
}

export const CartItems = ({
  selectedItems,
  setSelectedItems,
}: CartItemsProps) => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const cartItems = useQuery(
    ["cart", userEmail],
    async () => await fetchCartItems(userEmail),
    {
      enabled: status === "authenticated",
    }
  );

  function selectCartItem(cartItem: CartItem) {
    setSelectedItems((items) => [...items, cartItem]);
  }

  function deselectCartItem(cartItemId: number) {
    setSelectedItems((items) =>
      items?.filter((selectedItem) => cartItemId !== selectedItem.id)
    );
  }

  useEffect(() => {
    if (cartItems.data?.length) {
      setSelectedItems(
        cartItems.data.map((cartItem) => ({
          id: cartItem.id,
          product_id: cartItem.product_id,
          product: { ...cartItem.product },
          amount: cartItem.amount,
        }))
      );
    }
  }, []);

  return (
    <div className="w-full px-5 lg:w-4/6 lg:px-8">
      <div className="flex w-full flex-col gap-4">
        {cartItems.isLoading
          ? generateSkeleton(3)
          : cartItems.data?.map((item) => (
              <CartItemCard
                key={item.id}
                user={userEmail as string}
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

        {!cartItems.isLoading && !cartItems.data?.length ? (
          <div className="flex h-96 flex-col items-center justify-center gap-2.5">
            <span className="opacity-50">No items in Cart</span>
            <RxCrossCircled size="25" className="opacity-50" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
