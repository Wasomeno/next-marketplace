import React from "react";

import { Order, OrderStatus, Product } from "@prisma/client";

interface TransactionItemCardProps {
  transactionDetails: Order & {
    products: Product[];
    status: OrderStatus;
  };
}

export const OrderCard = ({ transactionDetails }: TransactionItemCardProps) => {
  const date = new Date(transactionDetails.created_at);
  return (
    <div className="flex h-32 flex-col rounded-md bg-white px-4 py-2.5 shadow-md lg:h-36">
      <div className="flex items-center gap-3 lg:h-10">
        <div className="text-xs">{date.toDateString()}</div>
        <span className="rounded-md bg-blue-200 p-1.5 text-xs">
          {transactionDetails.status.name}
        </span>
        <div className="hidden text-xs lg:block">{transactionDetails.id}</div>
      </div>
      <div className="flex flex-1 items-center gap-10">
        <div className="flex w-4/6 items-center gap-2.5 border-r border-r-slate-300">
          {transactionDetails.products.map((product) => (
            <div
              key={product.id}
              className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-center text-xs lg:h-16 lg:w-16"
            >
              {product.name}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h5 className="text-xs font-medium lg:text-sm">Total</h5>
          <span className="text-sm lg:text-base">
            Rp. {transactionDetails.total}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="flex h-40 flex-col gap-2 rounded-md bg-white p-2.5 shadow-md">
      <div className="flex h-10 items-center gap-3">
        <div className="h-6 w-24 animate-pulse rounded-md bg-slate-300" />
        <div>
          <div className="h-6 w-28 animate-pulse rounded-md bg-slate-300" />
        </div>
        <div className="h-6 w-32 animate-pulse rounded-md bg-slate-300" />
      </div>
      <div className="flex items-center gap-10">
        <div className="flex w-4/6 items-center gap-2.5 border-r border-r-slate-300">
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-10 animate-pulse rounded-md bg-slate-300" />
          <div className="h-6 w-7 animate-pulse rounded-md bg-slate-300" />
        </div>
      </div>
    </div>
  );
};
