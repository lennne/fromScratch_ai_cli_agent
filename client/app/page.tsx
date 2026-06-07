"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  // always remember useEffects run after the component has
  // rendered(in other words useeEffects are the last to run so think of them as
  // behind the last return function)
  // use a useEffect to check if the user has been signed in
  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      return router.push("/sign-in");
    }
  }, [data, isPending, router]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (!data?.session && !data?.user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <div className="space-y-8">
          {/* Profile Header Card */}
          <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 bg-zinc-900/50 backdrop-blur-sm">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Image
                  src={data?.user?.image || "/vercel.svg"}
                  alt={data?.user?.name || "User"}
                  height={120}
                  width={120}
                  className="rounded-full border-2 border-dashed border-zinic-600 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold text-zinc-50 truncate">
                Welcome, {data?.user?.name}
              </h1>
              <p className="text-sm text-zinc-400">Authenticated User</p>
            </div>
          </div>

          {/* User Details */}
          <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 bg-zinc-900/50 backdrop-blur-sm">
            {/* Notice that everytime we have two or more components grouped, we dono't just start inserting 
            The components but we wrap them in a div and then specify a space between them. This way we 
            are able to control the space and arrangement from one component instead of manually speicifying 
            the style of both of them which is a headache.
        */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Email Address
              </p>
              <p className="text-lg text-zinc-100 font-medium break-all">
                {data?.user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <Button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onError: (ctx) => console.log(ctx),
                    onSuccess: () => router.push("/sign-in"),
                  },
                })
              }
              className="bg-red-600 w-full h-11 text-white font-semibold rounded-lg transition-colors"
            >
              Sign out
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px border-t border-dashed border-zinc-700"></div>
              <span className="text-xs font-bold text-zinc-600">
                Session Active
              </span>
              <div className="flex-1 h-px border-t border-dashed border-zinc-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
