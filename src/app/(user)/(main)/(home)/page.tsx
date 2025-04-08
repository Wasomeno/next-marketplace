import { getCategories } from "@/actions/categories"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { RxArrowTopRight } from "react-icons/rx"

export const metadata: Metadata = {
  title: "Shopping Made Easy with Next Marketplace",
  description: "The best place to shop for your daily needs",
}

export default async function Home() {
  const categories = await getCategories()
  return (
    <div className="relative flex flex-1 flex-col gap-6 bg-white px-4 dark:bg-neutral-950 lg:px-28">
      <div className="w-full h-[30rem] bg-gray-100 rounded-lg py-10 gap-20 px-14 flex justify-end items-center">
        <div className="space-y-6">
          <div className="space-y-2 w-96">
            <h1 className="text-3xl font-bold">Shop the Latest Trends</h1>
            <p className="text-muted-foreground">
              From everyday essentials to statement pieces, we’ve got you
              covered
            </p>
          </div>
          <div>
            <Link href={"/discover"}>
              <Button variant="default" size="default" className="bg-white">
                Shop now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="h-[30rem] bg-gray-100 flex gap-10 items-center rounded-lg py-10 px-14"
          >
            <Image
              src={category.image?.url ?? "-"}
              alt="clothing-image"
              height={300}
              width={320}
            />
            <div className="space-y-6">
              <div className="space-y-2">
                <h5 className="text-2xl font-bold">{category.name}</h5>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div>
                <Link href={`/categories/${category.slug}`}>
                  <Button variant="default" size="default" className="bg-white">
                    Discover More <RxArrowTopRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
