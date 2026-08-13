import { Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function AccessRestrictedNotice({
  flagName,
  message,
}: {
  flagName: string;
  message?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <Lock className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">Access restricted</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          {message ??
            `Your current persona does not satisfy the "${flagName}" role-targeting rule. Switch persona from the top bar to view this section.`}
        </p>
      </CardContent>
    </Card>
  );
}
