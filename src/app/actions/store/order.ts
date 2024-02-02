"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { Order, Prisma } from "@prisma/client";

import { BaseDataFilters } from "../../../../types";
import { getStore } from "./store";

interface StoreOrder extends Order {
  productAmount: number
}

type GetStoreOrderProps = BaseDataFilters

