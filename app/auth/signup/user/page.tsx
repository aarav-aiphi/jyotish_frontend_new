"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; 
import { signupUser, selectLoading, selectError } from "@/redux/userSlice";

// Reusable container
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

  const dispatch = useAppDispatch();
  const router   = useRouter();
  const loading  = useAppSelector(selectLoading);
  const error    = useAppSelector(selectError);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Dispatch signup
    const resultAction = await dispatch(
      signupUser({ firstName, lastName, email, password })
    );
    if (signupUser.fulfilled.match(resultAction)) {
      // On success, you can redirect to home, login, or a “dashboard”
      router.push("/auth/login");
    }
  };

  return (
    <div className="h-[100vh] flex items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Sign Up As User
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Tyler"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Durden"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>

          {error && (
            <p className="text-red-500 mb-4 text-sm">
              {error}
            </p>
          )}

          <button
            className="relative group/btn bg-black bg-opacity-85 dark:from-zinc-900
                       dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800
                       w-full text-white rounded-md h-10 font-medium"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up →"}
          </button>

          <div className="text-center p-2 text-blue-500 ">
            <Link href="/auth/login">Login Instead</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
