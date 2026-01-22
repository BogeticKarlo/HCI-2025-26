"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase } from "../../lib/supabase";

import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { signupSchema } from "../../zodSchema/authSchema";

type SignupForm = z.infer<typeof signupSchema>;
type SignupErrors = Partial<Record<keyof SignupForm, string>>;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<SignupErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const result = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: SignupErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupForm;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    if (!data.session) {
      router.push("/login");
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
        <div className="bg-section-bg rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col md:flex-row">
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
              Sign Up
            </h1>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                error={errors.confirmPassword}
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
                Create Account
              </Button>
            </form>

            <p className="mt-6 font-display font-semibold text-[18px] leading-normal text-primary-text">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-2 hover:opacity-80"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
