import { ArrowRight, Bookmark, Lock } from "lucide-react";

import { siteCopy } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ReframeDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="bg-card/85">
        <CardHeader className="space-y-3">
          <CardTitle className="font-serif text-3xl tracking-[-0.02em]">
            Capture the moment
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            This scaffold focuses on structure, tone, and information flow. The
            submit action is intentionally staged for the next implementation
            step.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldBlock
            label="What did you see?"
            description="A promotion post, a founder update, a peer milestone, a polished life moment."
          >
            <Textarea
              placeholder="Example: I saw someone my age post about raising a round and getting featured everywhere."
              rows={4}
            />
          </FieldBlock>
          <FieldBlock
            label="What did your brain tell you?"
            description="Name the conclusion, not the polished version of it."
          >
            <Textarea
              placeholder="Example: I am behind, I missed my window, and everyone else has figured it out."
              rows={4}
            />
          </FieldBlock>
          <FieldBlock
            label="What is actually true about your life right now?"
            description="Responsibilities, constraints, progress, tradeoffs, recovery, finances, care work, timing."
          >
            <Textarea
              placeholder="Example: I am rebuilding after burnout, supporting my family, and making slower but steadier progress."
              rows={4}
            />
          </FieldBlock>
          <FieldBlock
            label="Optional title"
            description="Useful later for local saved reframes."
          >
            <Input placeholder="After the LinkedIn spiral" />
          </FieldBlock>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1 justify-between">
              Generate reframe
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 justify-between">
              Save locally
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 rounded-[1.25rem] bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            OpenAI responses and storage wiring come next. Local drafts and
            saved reframes will stay on-device.
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/70">
        <CardHeader className="space-y-3">
          <CardTitle className="font-serif text-3xl tracking-[-0.02em]">
            Structured output
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            The response format is designed to feel calm and exacting rather
            than inspirational.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {siteCopy.reframeSections.map((section) => (
            <div
              key={section.title}
              className="rounded-[1.4rem] border border-border/80 bg-card/85 p-5"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {section.title}
              </p>
              <p className="mt-2 text-sm leading-6">{section.preview}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FieldBlock({
  label,
  description,
  children
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
