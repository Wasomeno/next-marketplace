import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Cart, Prisma } from "@prisma/client";

import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { CartItemsSection } from "./components/cart-items-section";

export type CartItemWithProductPrice = Prisma.CartItemGetPayload<{
  select: {
    amount: true;
    id: true;
    product: { select: { price: true } };
    product_id: true;
  };
}>;

export type CartItemWithProductImage = Prisma.CartItemGetPayload<{
  include: { product: { include: { images: true } } };
}>;

export const metadata = {
  title: "Cart | Next Marketplace",
};

export default async function Cart() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-4 px-5 text-base lg:px-8 lg:text-xl">Shopping Cart</h1>
      <CartItemsSection user={session.user?.email as string} />
    </div>
  );
}
