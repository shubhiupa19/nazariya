import { guardrails } from "@/lib/site";

export function GuardrailsPanel() {
  return (
    <div className="surface-card rounded-[1.75rem] border border-border/70 bg-secondary/55 p-8">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Guardrails
      </p>
      <div className="mt-5 space-y-4">
        {guardrails.map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-border/70 bg-background/75 px-4 py-3 text-sm leading-6"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
