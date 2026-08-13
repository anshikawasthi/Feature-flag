"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useFlag } from "@/hooks/use-flag";
import { useVariant } from "@/hooks/use-variant";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import { useModuleAccessTracking } from "@/hooks/use-module-access";
import { useTheme } from "next-themes";

export default function NexusSettingsModulePage() {
  useModuleAccessTracking("settings", "Settings module accessed");
  const darkModeEnabled = useFlag("enable_dark_mode");
  const layout = useVariant("homepage_layout");
  const setOverride = useFlagOverridesStore((s) => s.setOverride);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Nexus Enterprise workspace preferences module."
      />
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Controlled by enable_dark_mode</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Enable dark mode toggle</Label>
          <Switch
            checked={darkModeEnabled}
            onCheckedChange={(v) => setOverride("enable_dark_mode", { enabled: v })}
          />
        </CardContent>
        {darkModeEnabled && (
          <CardContent className="flex items-center justify-between border-t border-border pt-4">
            <Label>Theme</Label>
            <Badge
              className="cursor-pointer"
              variant="outline"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? "Dark" : "Light"} · click to toggle
            </Badge>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage layout</CardTitle>
          <CardDescription>Multivariate flag homepage_layout</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">{layout}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
