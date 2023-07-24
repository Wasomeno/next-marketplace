"use client";

import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { Button } from "./ui/button";

export const SignInProviders = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        variant="defaultOutline"
        onClick={() =>
          signIn("google", { callbackUrl: "http://localhost:3000" })
        }
        className="border-slate-300 hover:bg-slate-100"
      >
        <FcGoogle className="h-6 w-6 lg:h-6 lg:w-6" />
      </Button>
      <Button
        disabled
        variant="defaultOutline"
        className="border-slate-300 hover:bg-slate-100"
      >
        <AiFillGithub className="h-6 w-6 lg:h-6 lg:w-6" />
      </Button>
    </div>
  );
};
