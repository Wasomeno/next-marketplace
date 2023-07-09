"use client";

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { Separator } from "@radix-ui/react-separator";

const Register = () => (
  <main className="flex items-center justify-center">
    <div className="h-full w-2/6 bg-slate-200"></div>
    <div className="flex h-full w-4/6 flex-col items-center justify-center">
      <div className="flex h-4/6 w-3/6 flex-col items-center rounded-lg p-4 shadow-lg">
        <h1 className="my-2 tracking-wider">Register</h1>
        <form className="flex w-5/6 flex-col items-start gap-2">
          <div className="w-full">
            <label id="email" className="text-sm tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="my-2 w-full rounded-md border border-slate-300 bg-slate-100 p-2 text-base"
            />
          </div>
          <div className="w-full">
            <label id="password" className="text-sm tracking-wide">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="my-2 w-full rounded-md border border-slate-300 bg-slate-100 p-2 text-base"
            />
          </div>
          <button className="w-full rounded-md bg-gray-500 py-2 text-sm font-medium tracking-wide text-white">
            Submit
          </button>
        </form>
        <div className="my-4 flex w-full items-center justify-center gap-2">
          <Separator
            decorative
            style={{ height: "1px" }}
            className="w-2/6 bg-slate-200"
          />
          <span className="text-sm text-slate-500">Or</span>
          <Separator
            decorative
            style={{ height: "1px" }}
            className="w-2/6 bg-slate-200"
          />
        </div>
        <div className="flex w-5/6 flex-col gap-2">
          <button className="flex w-full items-center justify-center gap-4 rounded-md bg-slate-200 p-2">
            <FcGoogle size="25" />
          </button>
          <button className="flex w-full items-center justify-center gap-4 rounded-md bg-slate-200 p-2">
            <AiFillGithub size="25" />
          </button>
        </div>
      </div>
    </div>
  </main>
);
export default Register;
