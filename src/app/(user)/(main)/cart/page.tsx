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
    <div className="flex flex-1 flex-col">
      <h1 className="mb-4 px-5 text-base lg:px-8 lg:text-xl">Shopping Cart</h1>
      <CartItemsSection />
    </div>
  );
}
