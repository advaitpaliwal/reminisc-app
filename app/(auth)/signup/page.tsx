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
      if (error.message === "User already registered") {
        return redirect(
          `/signup?message=${encodeURIComponent("User already registered")}`
        );
      }
      console.log("Sign up error: ", error);
      return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
    }

    return redirect(
      `/signin?message=${encodeURIComponent(
        "Check email to continue sign in process"
      )}`
    );
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ReminiscLogo height={32} width={32} className="mx-auto my-2" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>
        <SignupUserAuthForm formAction={signUp} />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
        {searchParams.message && (
          <span className="text-center text-sm text-red-600">
            {decodeURIComponent(searchParams.message)}
          </span>
        )}
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
