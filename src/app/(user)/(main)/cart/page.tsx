import { getCartItems } from "@/app/actions/cart";
import { BackButton } from "@/components/back-button";
import { CartItemsSection } from "@/components/user/cart/cart-items-section";
import { Cart, Prisma } from "@prisma/client";

export type CartItem = Prisma.CartItemGetPayload<{
  select: {
    amount: true;
    id: true;
    product: { include: { price: true; images: true } };
    product_id: true;
  };
}>;

export const metadata = {
  title: "Cart | Next Marketplace",
};

export default async function Cart() {
  const cart = await getCartItems();
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 px-4 lg:px-8">
        <div className="mb-2 flex gap-3 items-center">
          <BackButton />
          <h1 className="text-base font-medium lg:text-xl">Cart</h1>
        </div>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          {cart.count} items
        </span>
      </div>
      <CartItemsSection items={cart.items} />
    </div>
  );
}
