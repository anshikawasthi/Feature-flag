"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModuleDisabledNotice } from "@/components/feature-flags/module-disabled-notice";
import { useFlag } from "@/hooks/use-flag";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

export default function NexusAiAssistantPage() {
  useModuleAccessTracking("ai-assistant", "AI Assistant module accessed");
  const aiEnabled = useFlag("enable_ai_assistant");
  const killed = useFlag("disable_ai_system");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const available = aiEnabled && !killed;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="AI Assistant"
        description="Nexus AI Assistant — depends on enable_advanced_search and can be killed instantly."
        actions={
          <Badge variant={available ? "success" : "destructive"}>
            {available ? "Online" : killed ? "Killed via disable_ai_system" : "Disabled (dependency)"}
          </Badge>
        }
      />
      {!available ? (
        <ModuleDisabledNotice moduleName="AI Assistant" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-4" /> Nexus Assistant
            </CardTitle>
            <CardDescription>Ask a question about your Nexus Enterprise workspace.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex min-h-24 flex-col gap-2 rounded-lg border border-border p-3">
              {history.length === 0 && (
                <p className="text-xs text-muted-foreground">No messages yet.</p>
              )}
              {history.map((m, i) => (
                <p key={i} className="text-sm">
                  {m}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask the assistant…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    setHistory((h) => [...h, `You: ${message}`, "Assistant: Simulated response for demo purposes."]);
                    setMessage("");
                  }
                }}
              />
              <Button
                size="icon"
                onClick={() => {
                  if (!message.trim()) return;
                  setHistory((h) => [...h, `You: ${message}`, "Assistant: Simulated response for demo purposes."]);
                  setMessage("");
                }}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
