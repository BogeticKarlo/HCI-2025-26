"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { supabase } from "../../lib/supabase";

import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { loginSchema } from "../../zodSchema/authSchema";

type LoginForm = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof LoginForm;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center relative overflow-hidden font-playfair">
      {/* Background illustrations */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/assets/salad.png"
          alt="Salad"
          className="
            hidden lg:block 
            absolute 
            left-[6%] bottom-[12%]
            w-40 sm:w-52 md:w-64 lg:w-72 
            -rotate-45
          "
        />

        <img
          src="/assets/burger.png"
          alt="Burger"
          className="
            hidden lg:block 
            absolute 
            right-[6%] top-[8%]
            w-48 sm:w-60 md:w-72 
            rotate-30
          "
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 py-10">
        <div className="bg-section-bg rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col md:flex-row md:items-stretch">
          {/* Left side */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="font-display font-bold text-[40px] leading-[1.2] text-primary-text mb-4">
              Welcome to
              <br />
              Recipe Share
            </h1>

            <p className="font-display font-semibold text-[26px] leading-[1.3] text-body-text max-w-md">
              Join the Recipe Share community.
              <br />
              Discover new dishes, share your own,
              <br />
              and sharpen your cooking skills.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[3px] bg-primary-text my-10" />

          {/* Right side – form */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="font-display font-bold text-[40px] leading-[1.2] text-primary-text mb-6">
              Log In
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                error={errors.password}
              />

              {formError && (
                <p className="text-error-border text-[14px] leading-normal">
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                className="mt-2"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Log In
              </Button>
            </form>

            <p className="mt-6 font-display font-semibold text-[18px] leading-normal text-primary-text">
              New to Recipe Share?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-2 hover:opacity-80"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
