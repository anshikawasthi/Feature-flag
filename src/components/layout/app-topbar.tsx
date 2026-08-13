"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PersonaSwitcher } from "@/components/feature-flags/persona-switcher";
import { ProviderSwitcher } from "@/components/feature-flags/provider-switcher";
import { EnvironmentSwitcher } from "@/components/feature-flags/environment-switcher";
import { ThemeToggle } from "./theme-toggle";
import { SidebarContent } from "./app-sidebar";
import { useAppSettings } from "@/hooks/use-app-settings";
import { PERSONA_MAP } from "@/types/persona";

export function AppTopbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { persona } = useAppSettings();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 md:hidden">
        <Badge variant="secondary" className="capitalize">
          {PERSONA_MAP[persona].label}
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <PersonaSwitcher />
        <ProviderSwitcher />
        <EnvironmentSwitcher />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ThemeToggle />
      </div>
    </header>
  );
}
