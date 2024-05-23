"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { IconGoogle } from "@/components/icons";
import { Loader } from "lucide-react";
// import { createClient } from "@/utils/supabase/client";

export function LoginButton({ className, ...props }: ButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  // const supabase = createClient();
  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        // supabase.auth.signInWithOAuth({
        //   provider: "google",
        //   options: {
        //     redirectTo: `${origin}/auth/callback`,
        //   },
        // });

        // setIsLoading(false);
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <Loader className="mr-2 animate-spin" />
      ) : (
        <IconGoogle className="mr-2 size-5" />
      )}
      <span>Sign in</span>
    </Button>
  );
}
