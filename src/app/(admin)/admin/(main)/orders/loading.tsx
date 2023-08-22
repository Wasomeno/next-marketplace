import { ImSpinner7 } from "react-icons/im"

import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

export default function OrderLoadingPage() {
  return (
    <PageTransitionWrapper className="flex w-full flex-1 flex-col items-center justify-center bg-gray-50 p-5 dark:bg-neutral-900">
      <ImSpinner7 className="animate-spin fill-blue-500" size="30" />
    </PageTransitionWrapper>
  )
}
