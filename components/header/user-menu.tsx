"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useMemo, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

function getUserInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`;
}

export function UserMenu() {
  const { user, signOut, loading } = useUser();
  const router = useRouter();

  const userInitials = useMemo(() => {
    if (user?.user_metadata.first_name && user?.user_metadata.last_name) {
      return getUserInitials(
        user.user_metadata.first_name,
        user.user_metadata.last_name
      );
    }
    return "";
  }, [user]);

  const handleSignOut = useCallback(() => {
    signOut();
    router.push("/signin");
  }, [signOut, router]);

  if (loading) {
    return <Loader className="animate-spin mr-2" />;
  }

  if (!user) {
    return (
      <Button
        className="ml-auto gap-1 text-sm"
        variant="default"
        size="sm"
        asChild
      >
        <Link href="/signin">Sign In</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-2">
            {user?.user_metadata.avatar_url ? (
              <Image
                height={32}
                width={32}
                className="size-6 select-none rounded-full ring-1 ring-zinc-100/10 transition-opacity duration-300 hover:opacity-80"
                src={user?.user_metadata.avatar_url || ""}
                alt={user.user_metadata.name ?? "Avatar"}
                unoptimized
              />
            ) : (
              <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-muted/100 text-xs font-medium uppercase text-muted-foreground">
                {userInitials}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px]">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs font-medium">
              {user?.user_metadata.name}
            </div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://www.reminisc.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between text-xs"
            >
              Reminisc Homepage
              <ExternalLinkIcon className="ml-auto h-3 w-3" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="text-xs">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
