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
  return (
    <div className="flex flex-1 flex-col ">
      <div className="mb-4 flex items-center gap-2 px-2 lg:px-8">
        <BackButton />
        <h1 className="text-base font-medium lg:text-xl">Shopping Cart</h1>
      </div>

      <CartItemsSection />
    </div>
  );
}
