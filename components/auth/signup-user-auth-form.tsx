"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import Link from "next/link";

const userAuthSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  formAction: (data: FormData) => void;
}

type FormData = z.infer<typeof userAuthSchema>;

export function SignupUserAuthForm({
  formAction,
  className,
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await formAction(data);
    setIsLoading(false);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name" className="block mb-2">
                First name
              </Label>
              <Input
                id="first-name"
                placeholder="Advait"
                required
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="last-name" className="block mb-2">
                Last name
              </Label>
              <Input
                id="last-name"
                placeholder="Paliwal"
                required
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="advait@reminisc.ai"
              required
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin mr-2" />
            ) : (
              "Create an account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
