import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center">
      <div className="grid w-5/6 grid-cols-12 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="col-span-4 flex h-24 items-center justify-center rounded-lg border bg-slate-100 text-xs shadow-sm lg:col-span-2 lg:h-40 lg:text-base"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
