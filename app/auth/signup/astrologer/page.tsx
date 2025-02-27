"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signupAstrologer, selectLoading, selectError } from "@/redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";

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
  const [step, setStep] = useState(1);

  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languages, setLanguages] = useState("");
  const [experience, setExperience] = useState("");
  const [costPerMinute, setCostPerMinute] = useState("");
  const [about, setAbout] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const languagesArray = languages.split(",").map((lang) => lang.trim());

    const resultAction = await dispatch(
      signupAstrologer({
        name,
        username,
        email,
        password,
        languages: languagesArray,
        experience: Number(experience),
        costPerMinute: Number(costPerMinute),
        about,
      })
    );

    if (signupAstrologer.fulfilled.match(resultAction)) {
      router.push("/auth/login");
    }
  };

  const variants = {
    initial: { opacity: 0, x: -20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.4 } },
  };

  return (
    <div className="h-[100vh] flex items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Sign Up As Astrologer
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <div className="flex flex-col space-y-4">
                  <LabelInputContainer>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Tyler"
                      type="text"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Durden"
                      type="text"
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      placeholder="projectmayhem@fc.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </LabelInputContainer>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-4 w-full bg-black text-white py-2 rounded-md"
                >
                  Next Step →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <div className="flex flex-col space-y-4">
                  <LabelInputContainer>
                    <Label htmlFor="languages">Languages (comma separated)</Label>
                    <Input
                      id="languages"
                      placeholder="English, Hindi"
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      placeholder="5"
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="costPerMinute">Cost Per Minute</Label>
                    <Input
                      id="costPerMinute"
                      placeholder="50"
                      type="number"
                      value={costPerMinute}
                      onChange={(e) => setCostPerMinute(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="about">About</Label>
                    <Input
                      id="about"
                      placeholder="I am an experienced astrologer..."
                      type="text"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </LabelInputContainer>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="bg-gray-300 text-black py-2 px-4 rounded-md"
                  >
                    ← Previous Step
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up →"}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 mt-4 text-sm">{error}</p>
                )}

                
              </motion.div>
            )}
          </AnimatePresence><div className="text-center p-2 text-blue-500 mt-4">
                  <Link href="/auth/login">Login Instead</Link>
                </div>
        </form>
      </div>
    </div>
  );
}
