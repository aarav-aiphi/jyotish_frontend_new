// In some header or user menu:
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signoutUser } from "@/redux/userSlice";

export function SignOutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    await dispatch(signoutUser());
    // If signout is successful, redirect to login or homepage
    router.push("/auth/login");
  };

  return (
    <button onClick={handleSignOut} className="text-red-500">
      Sign Out
    </button>
  );
}
