import { Prisma } from "@prisma/client"
import { BiSolidStar } from "react-icons/bi"

export function ReviewCard({
  review,
}: {
  review: Prisma.ProductReviewGetPayload<{ include: { user: true } }>
}) {
  function censorEmail() {
    const [username, domain] = review.user.email?.split("@") as string[]
    return `${username.slice(0, 1)}*****${domain}`
  }
  return (
    <div className="w-full space-y-2 border-b py-4">
      <div className="flex items-center gap-1.5">
        {Array(review.rating)
          .fill(" ")
          .map((_, index) => (
            <BiSolidStar key={index} className="text-yellow-400" />
          ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-300" />
        <span className="text-sm">{censorEmail()}</span>
      </div>
      <div>
        <p className="text-sm">{review.review}</p>
      </div>
    </div>
  )
}
