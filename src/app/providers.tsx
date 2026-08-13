"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

import { FeatureFlagProvider } from "@/context/feature-flag-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <FeatureFlagProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </FeatureFlagProvider>
    </ThemeProvider>
  );
}
