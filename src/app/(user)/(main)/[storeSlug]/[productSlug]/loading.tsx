import { Skeleton } from "@/components/skeleton"
import { Separator } from "@/components/ui/separator"
import { WishListButton } from "./_components"

export default function ProductPageLoading() {
  return (
    <div className="relative flex flex-1 flex-col gap-10 lg:flex-row">
      <div className="flex-1 space-y-10 mx-24 my-4">
        <div className="flex flex-1 flex-wrap justify-center gap-10 lg:flex-nowrap lg:justify-normal">
          <Skeleton className="w-full lg:w-[45rem] lg:h-[45rem]" />
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="lg:h-[36px] w-52" />
              <WishListButton isWishlisted={false} />
            </div>
            <Skeleton className="mb-6 h-[32px] w-32" />
            <div className="flex mb-6 items-center gap-4">
              <Skeleton className="h-[32px] w-96" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
