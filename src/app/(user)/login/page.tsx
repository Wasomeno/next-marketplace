"use client";

import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import { Separator } from "@radix-ui/react-separator";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const loginMutation = useMutation(() =>
    toast.promise(signIn("google", { callbackUrl: "http://localhost:3000" }), {
      pending: "Signing in...",
      success: "Sign in success",
      error: "Sign in Failed",
    })
  );
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="flex h-full w-full flex-col items-center justify-center lg:w-4/6">
        <div className="flex w-5/6 flex-col items-center rounded-lg py-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)] lg:w-3/6">
          <h1 className="tracking-wider lg:text-xl">Login</h1>
          <form className="flex w-5/6 flex-col items-start gap-2">
            <div className="w-full">
              <label id="email" className="text-xs tracking-wide lg:text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="my-2 w-full rounded-md border border-slate-300 bg-slate-100 p-2 text-xs lg:text-base"
              />
            </div>
            <div className="w-full">
              <label id="password" className="text-xs tracking-wide lg:text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="my-2 w-full rounded-md border border-slate-300 bg-slate-100 p-2 text-xs lg:text-base"
              />
            </div>
            <button className="w-full rounded-md bg-gray-500 py-2 text-xs font-medium tracking-wide text-white lg:text-sm">
              Submit
            </button>
          </form>
          <div className="my-4 flex w-full items-center justify-center gap-2">
            <Separator
              decorative
              style={{ height: "1px" }}
              className="w-2/6 bg-slate-200"
            />
            <span className="text-xs text-slate-500 lg:text-sm">Or</span>
            <Separator
              decorative
              style={{ height: "1px" }}
              className="w-2/6 bg-slate-200"
            />
          </div>
          <div className="flex w-5/6 flex-col gap-2">
            <button
              onClick={() => loginMutation.mutate()}
              className="flex w-full items-center justify-center gap-4 rounded-md bg-slate-200 p-2"
            >
              <FcGoogle className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
            <button className="flex w-full items-center justify-center gap-4 rounded-md bg-slate-200 p-2">
              <AiFillGithub className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
