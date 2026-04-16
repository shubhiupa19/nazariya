import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { GuardrailsPanel } from "@/components/shared/guardrails-panel";

export default function AboutPage() {
  return (
    <PageShell className="gap-10 pb-20 pt-10 md:pt-14">
      <SectionHeading
        eyebrow="About"
        title="A perspective correction tool, designed with restraint."
        description="Nazariya is meant for clear thinking in emotionally loaded moments. The product should feel intelligent, calm, and bounded by careful ethical choices."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="surface-card rounded-[1.75rem] border border-border/70 bg-card/85 p-8">
          <div className="space-y-5">
            <p className="font-serif text-3xl leading-tight tracking-[-0.02em]">
              Comparison is often a context problem.
            </p>
            <p className="leading-7 text-muted-foreground">
              We compare our full, lived reality to a polished sliver of
              someone else&apos;s life. Nazariya is built to slow that reaction
              down and reconstruct the missing context without insulting the
              other person, shaming the user, or pretending hard feelings can be
              solved with slogans.
            </p>
            <p className="leading-7 text-muted-foreground">
              The product is intentionally narrow. It is not a therapy app, a
              diary, or a general advice chatbot. It focuses on one painful
              mental pattern and offers one clean intervention: a better
              perspective.
            </p>
          </div>
        </div>
        <GuardrailsPanel />
      </div>
    </PageShell>
  );
}
