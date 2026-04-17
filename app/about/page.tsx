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
              someone else&apos;s life. Nazariya slows that reaction down and
              reconstructs the missing context — without shaming the user,
              attacking the comparison target, or pretending hard feelings can
              be solved with slogans.
            </p>
            <p className="leading-7 text-muted-foreground">
              One part of that reconstruction is aspiration. The library
              includes grounded perspectives — people navigating real
              constraints toward something they are still building toward.
              Including one in a reframe is not an invitation to feel grateful
              by comparison. It is a way to see your own circumstances from the
              outside: as an arrival point someone else is still working toward.
              Aspiration, not pity.
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
