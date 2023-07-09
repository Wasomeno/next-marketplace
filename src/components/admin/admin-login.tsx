import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

export const AdminLogin = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-100">
      <div className="fixed left-1/2 top-1/2 h-80 w-72 -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg bg-slate-50 p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] lg:p-6 ">
        <h1 className="text-center text-base lg:text-lg">Admin Login</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            toast.promise(
              signIn("credentials", {
                username,
                password,
                callbackUrl: "/admin",
              }),
              {
                pending: "Signing in...",
                error: "Error",
                success: "Signin success",
              }
            );
          }}
          className="flex h-5/6 flex-col items-center justify-between"
        >
          <div className="flex h-4/6 flex-col justify-center gap-2">
            <div className="flex w-full flex-col gap-1.5">
              <label className="text-xs lg:text-sm">Username</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-lg border border-slate-400 p-1.5 text-xs lg:text-sm"
              />
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <label className="text-xs lg:text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-lg border border-slate-400 p-1.5 text-xs lg:text-sm"
              />
            </div>
          </div>
          <div className="flex w-full justify-center">
            <button className="w-3/6 rounded-lg bg-blue-200 py-2 text-xs font-medium tracking-wide lg:text-sm">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
