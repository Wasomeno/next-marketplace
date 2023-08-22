import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SignInProviders } from "@/components/sign-in-providers"

export const metadata: Metadata = {
  title: "Sign in | Next Marketplace",
}

export default async function Login() {
  return (
    <main className="flex flex-1 items-center justify-center dark:bg-neutral-950">
      <Link
        href="/"
        prefetch={false}
        className="absolute left-0 top-2 flex items-center"
      >
        <div className="relative h-12 w-12 lg:h-14 lg:w-14">
          <Image src="/next_marketplace.webp" alt="next-logo" fill />
        </div>
        <span className="font-sans text-xs font-medium tracking-tight lg:text-lg">
          Next Martketplace
        </span>
      </Link>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-4/6">
        <h1 className="font-sans text-xl font-medium tracking-tight lg:text-2xl">
          Sign in to my account
        </h1>
        <div className="flex w-5/6 flex-col items-center gap-2 rounded-lg lg:w-3/6">
          <SignInProviders />
          <div className="flex w-full items-center justify-center gap-2">
            <Separator
              decorative
              orientation="horizontal"
              className="dark: h-px w-full bg-slate-200 dark:bg-gray-500"
            />
            <span className="text-xs text-slate-500 dark:text-gray-500 lg:text-sm">
              Or
            </span>
            <Separator
              decorative
              orientation="horizontal"
              className="h-px w-full bg-slate-200 dark:bg-gray-500"
            />
          </div>

          <form className="flex w-full flex-col items-start">
            <div className="w-full">
              <label id="email" className="text-xs tracking-wide lg:text-sm">
                Email
              </label>
              <Input
                disabled
                id="email"
                type="email"
                className="my-2 w-full border-slate-300"
              />
            </div>
            <div className="w-full">
              <label id="password" className="text-xs tracking-wide lg:text-sm">
                Password
              </label>
              <Input
                disabled
                id="password"
                type="password"
                className="my-2 w-full border-slate-300"
              />
            </div>
            <Button
              disabled
              variant="default"
              className="mt-4 w-full text-xs font-medium tracking-wide hover:bg-blue-400  dark:bg-blue-900 lg:text-sm"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
