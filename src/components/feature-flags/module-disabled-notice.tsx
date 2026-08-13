import { PowerOff } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ModuleDisabledNotice({ moduleName }: { moduleName: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <PowerOff className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">{moduleName} is currently disabled</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Enable the corresponding flag from the Feature Flag Dashboard or Kill Switch
          Control Center to restore this module.
        </p>
      </CardContent>
    </Card>
  );
}
