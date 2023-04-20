"use client";

import * as Separator from "@radix-ui/react-separator";
import { useState } from "react";

const ProductPage = () => {
  const [amount, setAmount] = useState<number>(1);

  function increment(stock: number) {
    if (amount >= stock) return;
    setAmount((currentAmount) => currentAmount + 1);
  }

  function decrement() {
    if (amount <= 1) return;
    setAmount((currentAmount) => currentAmount - 1);
  }

  return (
    <main className="flex justify-center py-10">
      <div className="grid h-screen w-5/6 grid-cols-12 gap-10">
        <div className="col-start-1 col-end-5">
          <div className="h-3/6 rounded-sm bg-slate-200" />
          <div className="mt-4 flex items-center gap-4">
            <span className="h-16 w-16 rounded-md bg-slate-300" />
            <span className="h-16 w-16 rounded-md bg-slate-300" />
            <span className="h-16 w-16 rounded-md bg-slate-300" />
            <span className="h-16 w-16 rounded-md bg-slate-300" />
          </div>
        </div>
        <div className="col-start-5 col-end-10">
          <h1 className="text-xl font-medium">Product Name</h1>
          <div className="my-4 text-3xl font-medium">Rp. 1000</div>
          <Separator.Root
            decorative
            orientation="horizontal"
            className="my-2 w-full bg-slate-200"
            style={{ height: "1px" }}
          />
          <span className="text-base font-medium">Description</span>
          <Separator.Root
            decorative
            orientation="horizontal"
            className="my-2 w-full bg-slate-200"
            style={{ height: "1px" }}
          />
          <div>
            <p className="font-light">
              orem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur
            </p>
          </div>
        </div>
        <div className="col-start-10 col-end-13">
          <div className="rounded-md border border-slate-400 p-4">
            <span>Product Amount</span>
            <div className="my-4 flex items-center justify-center gap-4">
              <div className="relative flex w-3/6 items-center justify-center gap-4 rounded-md bg-slate-200 text-sm font-medium">
                <button onClick={decrement} className="h-8 w-8">
                  -
                </button>
                <p>{amount}</p>
                <button onClick={() => increment(999)} className="h-8 w-8">
                  +
                </button>
              </div>
              <span className="w-3/6 text-end text-sm">Stock: 131231</span>
            </div>

            <div className="my-2 flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-lg">Rp. 69969</span>
            </div>
            <button className="my my-1 w-full rounded-lg bg-slate-400 py-3 text-sm font-medium text-slate-50">
              Add to Cart
            </button>
            <button className="my my-1 w-full rounded-lg bg-slate-400 py-3 text-sm font-medium text-slate-50">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
