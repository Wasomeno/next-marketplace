"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { RxCrossCircled, RxMagnifyingGlass } from "react-icons/rx";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Order, OrderStatus, Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { OrderCard, OrderCardSkeleton } from "./components/order-card";

const statuses = [
  "All Statuses",
  "Payment Confirmed",
  "Processed",
  "On Shipping",
  "Shipped",
  "Completed",
];

export default function OrdersPage() {
  const [productSearch, setProductSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);

  const session = useSession();
  const user = session.data?.user?.email;

  const transactions = useQuery(
    ["transactions", session.data?.user?.email],
    async () => {
      const transactions = await axios.get(`/api/users/${user}/orders`);
      return transactions.data;
    },
    {
      enabled: session.status === "authenticated",
    }
  );

  function generateSkeleton(length: number) {
    let skeletons = [];
    for (let i = 0; i < length; i++) {
      skeletons.push(<OrderCardSkeleton />);
    }
    return skeletons.map((skeleton) => skeleton);
  }

  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4">
        <h1 className="text-base lg:text-xl">Orders</h1>
      </div>
      <div className="flex-1 rounded-lg border p-2.5 lg:w-4/6 lg:p-4">
        <div className="mb-2.5 flex items-center gap-2.5  overflow-x-scroll">
          <div className="flex h-8 items-center rounded-md border bg-white p-1.5 lg:h-10">
            <div className="flex w-10 items-center justify-center">
              <RxMagnifyingGlass className="text-slate-400" />
            </div>
            <Input
              type="text"
              value={productSearch}
              onChange={(event) => {
                setProductSearch(event.target.value);
              }}
              className="h-auto w-32 border-none p-0 focus-visible:ring-0 lg:w-96"
              placeholder="Search orders"
            />
          </div>
          <Dropdown>
            <DropdownTrigger asChild>
              <button className="flex h-8 items-center justify-center rounded-md border bg-white px-3 outline-0 lg:h-10 lg:w-72 lg:justify-between">
                <span className="text-xs lg:text-sm">{selectedStatus}</span>
                <div className="w-5">
                  <BiChevronRight size="20" className="text-slate-600" />
                </div>
              </button>
            </DropdownTrigger>
            <DropdownContent className="flex w-72 flex-col rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm">
              {statuses.map((status, index) => (
                <DropdownItem key={index} asChild>
                  <button
                    onClick={() => setSelectedStatus(status)}
                    className="px-3 py-2 text-start text-xs outline-0 ring-0 transition duration-200 hover:bg-blue-100 lg:text-sm"
                  >
                    {status}
                  </button>
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>
        <div className="flex w-full flex-col gap-2">
          {transactions.isLoading
            ? generateSkeleton(3)
            : transactions.data?.map(
                (
                  transaction: Order & {
                    products: Product[];
                    status: OrderStatus;
                  }
                ) => (
                  <OrderCard
                    transactionDetails={transaction}
                    key={transaction.id}
                  />
                )
              )}
          {!transactions.isLoading && !transactions.data.length ? (
            <div className="flex h-72 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm">No Transactions</span>
              <RxCrossCircled size="25" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
