"use client";
import React, { useState, Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, getCookie } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAuth } from "@/redux/hooks";
import { loginUser } from "@/redux/userSlice";

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

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/";


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();

      
      const token = getCookie('token'); 

      console.log("Token from cookie:", token);
      alert(token);

      router.push(redirectUrl);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form className="my-8" onSubmit={handleSubmit}>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          placeholder="projectmayhem@fc.com"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          defaultValue="test2@example.com"
        />
      </LabelInputContainer>

      <LabelInputContainer className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="••••••••"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          defaultValue="test123"
        />
      </LabelInputContainer>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <button
        className={cn(
          "relative w-full h-10 text-white rounded-md font-medium",
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black bg-opacity-85 hover:bg-opacity-95"
        )}
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login →"}
      </button>

      <div className="text-center p-2 text-blue-500">
        <Link href="/auth/signup">Sign Up Instead</Link>
      </div>
    </form>
  );
};

const LoginFormFallback = () => {
  return (
    <div className="my-8 animate-pulse">
      <div className="mb-4 h-20 bg-gray-200 rounded"></div>
      <div className="mb-4 h-20 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <div className="h-[100vh] flex items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Login
        </h2>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
