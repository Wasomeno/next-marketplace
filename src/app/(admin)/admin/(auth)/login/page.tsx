"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

const AdminLoginSchema = z.object({
  username: z
    .string()
    .min(5, "Username must have at least 5 characters")
    .max(25, "Username can't be more than 5 characters"),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .max(25, "Password can't be more than 5 characters"),
})

type AdminLoginFormData = z.infer<typeof AdminLoginSchema>

export default function AdminLoginPage() {
  const { register, handleSubmit, formState } = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminLoginSchema),
  })

  const signInMutation = useMutation({
    mutationFn: async (formData: AdminLoginFormData) => {
      await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        callbackUrl: "/admin",
      })
    },
    onSuccess: () => toast.success("Sign in success"),
  })

  return (
    <PageTransitionWrapper className="flex flex-1 flex-col items-center justify-center">
      <title>Login | Next Marketplace Admin</title>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-sans text-2xl font-semibold lg:text-3xl">
            Sign In
          </h1>
        </div>
        <form
          onSubmit={handleSubmit((formData) => signInMutation.mutate(formData))}
          className="flex flex-col gap-3"
        >
          <div className="space-y-2">
            <label className="text-xs font-medium lg:text-sm">Username</label>
            <Input
              type="string"
              placeholder="Username"
              className="w-72 text-xs dark:border-neutral-600 dark:bg-neutral-800 lg:text-sm"
              {...register("username")}
            />
            <AnimatePresence>
              {formState.errors.username && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-600 dark:text-red-800"
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
              placeholder="Password"
              className="w-72 text-xs dark:border-neutral-600 dark:bg-neutral-800 lg:text-sm"
              {...register("password")}
            />
            <AnimatePresence></AnimatePresence>
            {formState.errors.password && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-600 dark:text-red-800"
              >
                {formState.errors.password?.message}
              </motion.span>
            )}
          </div>
          <Button
            variant="default"
            className="bg-gray-200 shadow-sm lg:hover:bg-gray-300"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending && (
              <ImSpinner8 className="animate-spin" />
            )}
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
