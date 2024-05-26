"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquareTerminal, Code2, Book, Settings2 } from "lucide-react";
import ReminiscLogo from "./header/logo";
import React from "react";
import { cn } from "@/lib/utils";

interface NavBarProps {
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside
        className={cn(
          "fixed inset-y left-0 z-20 flex h-full flex-col border-r",
          className
        )}
      >
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home" disabled>
            <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="rounded-lg"
              disabled
            >
              <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
            </Button>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed inset-y left-0 z-20 flex h-full flex-col border-r",
        className
      )}
    >
      <div className="border-b p-2">
        <Link href="/">
          <Button variant="outline" size="icon" aria-label="Home">
            <ReminiscLogo />
          </Button>
        </Link>
      </div>
      <nav className="grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/playground">
              <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-lg", {
                  "bg-muted": isActive("/playground"),
                })}
                aria-label="Playground"
              >
                <SquareTerminal className="size-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Playground
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/api-keys">
              <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-lg", {
                  "bg-muted": isActive("/api-keys"),
                })}
                aria-label="API"
              >
                <Code2 className="size-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            API
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="https://api.reminisc.ai/docs">
              <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-lg", {
                  "bg-muted": isActive("/documentation"),
                })}
                aria-label="Documentation"
              >
                <Book className="size-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Documentation
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};
