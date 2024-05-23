import { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReminiscLogo from "@/components/header/logo";
import { SigninUserAuthForm } from "@/components/auth/signin-user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function SigninPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (data: { email: string; password: string }) => {
    "use server";
    const { email, password } = data;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(
        `/signin?message=${encodeURIComponent("Could not authenticate user")}`
      );
    }

    return redirect("/");
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ReminiscLogo height={40} width={40} className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <SigninUserAuthForm formAction={signIn} />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
