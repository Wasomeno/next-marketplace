"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToolbarThemeSwitcher } from "@/components/admin/toolbar-theme-switcher"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

const AdminLoginSchema = z.object({
  username: z.string().min(5).max(25),
  password: z.string().min(6).max(25),
})

type AdminLoginFormData = z.infer<typeof AdminLoginSchema>

export default function AdminLoginPage() {
  const { register, handleSubmit, getValues, formState } =
    useForm<AdminLoginFormData>({
      resolver: zodResolver(AdminLoginSchema),
    })

  return (
    <PageTransitionWrapper className="flex flex-1 flex-col items-center justify-center">
      <title>Login | Next Marketplace Admin</title>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-sans text-2xl font-semibold lg:text-3xl">
            Sign In
          </h1>
          <ToolbarThemeSwitcher />
        </div>
        <form
          onSubmit={handleSubmit(() =>
            toast.promise(
              signIn("credentials", {
                username: getValues("username"),
                password: getValues("password"),
                callbackUrl: "/admin",
              }),
              {
                pending: "Signing in...",
                error: "Error",
                success: "Sign in Success",
              }
            )
          )}
          className="flex flex-col gap-3"
        >
          <div className="space-y-2">
            <label className="text-xs font-medium lg:text-sm">Username</label>
            <Input
              type="string"
              className="w-72 text-xs dark:border-neutral-600 dark:bg-neutral-800 lg:text-sm"
              {...register("username")}
            />
            <AnimatePresence>
              {formState.errors.username && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-600 dark:text-red-800 lg:text-sm"
                >
                  {formState.errors.username?.message}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium lg:text-sm">Password</label>
            <Input
              type="password"
              className="w-72 text-xs dark:border-neutral-600 dark:bg-neutral-800 lg:text-sm"
              {...register("password")}
            />
            <AnimatePresence></AnimatePresence>
            {formState.errors.password && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-600 dark:text-red-800 lg:text-sm"
              >
                {formState.errors.password?.message}
              </motion.span>
            )}
          </div>
          <Button
            variant="default"
            className="bg-blue-500 font-medium text-white dark:bg-blue-800"
          >
            Sign in
          </Button>
        </form>
      </div>
      <span className="absolute bottom-5 text-xs font-medium opacity-50 lg:text-sm">
        Next Marketplace
      </span>
    </PageTransitionWrapper>
  )
}
