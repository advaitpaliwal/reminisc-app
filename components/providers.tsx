"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        {children}
        <Analytics />
      </TooltipProvider>
      <Toaster expand={false} position="top-center" />
    </NextThemesProvider>
  );
}
