"use client";

import { FaShoppingCart } from "react-icons/fa";
import { Primitive } from "@radix-ui/react-primitive";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="flex h-14 items-center justify-evenly">
      <Link href="/" className="font-sans text-2xl text-neutral-900">
        Logo
      </Link>
      <Primitive.form className="w-4/6">
        <Primitive.input
          placeholder="Search..."
          className="w-full rounded-md bg-slate-100 p-2 font-sans text-sm"
        />
      </Primitive.form>
      <button className="font-sans">
        <FaShoppingCart size="20" className="fill-slate-500" />
      </button>
      <button className="rounded-md bg-neutral-200 px-3 py-2 font-sans text-sm">
        Sign In
      </button>
      <button className="rounded-md border border-neutral-200 px-3 py-2 font-sans text-sm">
        Sign Up
      </button>
    </nav>
  );
};
