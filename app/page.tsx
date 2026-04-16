import Link from "next/link";

import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

const steps = [
  {
    label: "What you saw",
    copy: "The polished milestone, announcement, post, or update that hit a nerve."
  },
  {
    label: "What you felt",
    copy: "Envy, contraction, embarrassment, urgency, disappointment, or grief."
  },
  {
    label: "What’s true",
    copy: "The context you actually know, the context you do not know, and your present reality."
  }
];

const reframes = [
  {
    title: "Observed event",
    copy:
      "A former coworker posted that she bought an apartment and got engaged in the same month."
  },
  {
    title: "Automatic conclusion",
    copy:
      "My life is late. Everyone else is becoming settled while I am still trying to get stable."
  },
  {
    title: "Missing context",
    copy:
      "You are seeing an outcome, not the private timeline behind it. You do not know her debt, family support, relationship history, compromises, or what this season costs her."
  },
  {
    title: "Perspective correction",
    copy:
      "Her milestone may be real without being a verdict on your pace. Your life is being built under different conditions, with different constraints, and should be evaluated against what is true for you now."
  }
];

const distinctions = [
  {
    title: "Not motivation",
    copy: "It does not hype you up or turn pain into a performance speech."
  },
  {
    title: "Not comparison-down",
    copy:
      "It does not ask you to feel better by finding someone who is doing worse."
  },
  {
    title: "Not therapy",
    copy:
      "It does not diagnose, process trauma, or substitute for deeper care."
  },
  {
    title: "Just perspective correction",
    copy:
      "It helps restore proportion when a visible milestone starts acting like a complete truth."
  }
];

export default function HomePage() {
  return (
    <PageShell className="gap-24 pb-24 pt-8 md:gap-32 md:pb-32 md:pt-14">
      <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-8 md:space-y-10">
          <div className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-muted-foreground motion-enter">
            Perspective correction
          </div>
          <div className="space-y-6 motion-enter motion-delay-1">
            <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] tracking-[-0.045em] text-balance sm:text-7xl md:text-[5.5rem]">
              Nazariya
            </h1>
            <p className="max-w-2xl font-serif text-3xl leading-tight tracking-[-0.03em] text-foreground sm:text-4xl">
              See your life more clearly.
            </p>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Nazariya is a calm tool for the moment comparison narrows your
              judgment. It helps you separate what was visible, what was
              inferred, and what is actually true so the conclusion becomes more
              accurate.
            </p>
          </div>
          <div className="flex flex-col gap-3 motion-enter motion-delay-2 sm:flex-row">
            <Button asChild size="lg">
              <Link href={"/app" as never}>Try a reframe</Link>
            </Button>
          </div>
        </div>

        <div className="editorial-frame surface-card motion-enter motion-delay-2 rounded-[2rem] border border-border bg-card p-5 md:p-7">
          <div className="space-y-5 rounded-[1.6rem] border border-border/80 bg-background px-5 py-6 md:px-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>Example output</span>
              <span>Structured reframe</span>
            </div>
            <div className="space-y-4">
              {reframes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] border border-border/70 bg-card px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/90 sm:text-[15px]">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 border-y border-border/80 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-20">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            The problem
          </p>
          <h2 className="max-w-xl font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
            We mistake a polished milestone for a complete measure of a life.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          People compare their full inner reality to someone else&apos;s visible
          milestone and conclude they are behind. The distortion feels factual
          because the milestone is real, but the comparison is built on missing
          context, incomplete information, and a harsh edit of one&apos;s own
          life.
        </p>
      </section>

      <section className="space-y-10">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
              How it works
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
              A simple input, then a cleaner frame.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Nazariya asks for three things: what you saw, what you felt, and
            what is true. From that, it returns a structured reframe that
            distinguishes the observed event from the story your mind built
            around it.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_0.2fr_0.9fr]">
          <div className="surface-card rounded-[1.8rem] border border-border bg-card p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Input
            </p>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.label}
                  className="rounded-[1.25rem] border border-border/70 bg-background px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {step.label}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-sm text-muted-foreground">
              to
            </div>
          </div>

          <div className="surface-card rounded-[1.8rem] border border-border bg-card p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Output
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-[1.25rem] border border-border/70 bg-background px-5 py-4">
                <p className="text-sm font-medium text-foreground">
                  Structured reframe
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  A calm response organized into observed event, automatic
                  conclusion, missing context, and perspective correction.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border/70 bg-background px-5 py-4">
                <p className="text-sm font-medium text-foreground">
                  Result
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Less distortion, less self-accusation, and a more accurate
                  understanding of where you actually stand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:gap-16">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            Why it&apos;s different
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
            It stays narrow on purpose.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {distinctions.map((item) => (
            <div
              key={item.title}
              className="surface-card rounded-[1.6rem] border border-border bg-card p-6"
            >
              <p className="font-serif text-2xl leading-tight tracking-[-0.02em]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
