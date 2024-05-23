import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReminiscLogo from "@/components/header/logo";
import { SignupUserAuthForm } from "@/components/auth/signup-user-auth-form";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    "use server";
    const origin = headers().get("origin");
    const { email, password, firstName, lastName } = data;

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      return redirect(
        `/signup?message=${encodeURIComponent("Could not authenticate user")}`
      );
    }

    return redirect(
      `/signin?message=${encodeURIComponent(
        "Check email to continue sign in process"
      )}`
    );
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ReminiscLogo height={40} width={40} className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <SignupUserAuthForm formAction={signUp} />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
