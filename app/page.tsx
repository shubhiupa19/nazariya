import Link from "next/link";

import { stories } from "@/data/stories";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

const tickerItems = [
  "What happened",
  "What's missing",
  "A real perspective",
  "Re-anchor",
];

const reframeSections = [
  {
    title: "What happened",
    copy: "You saw a polished update that bundled career momentum and visible stability into one sharp comparison point. Your mind took that moment and treated it like a verdict on the state of your own life."
  },
  {
    title: "What's missing",
    copy: "You are seeing the outcome, not the structure underneath it. You do not know the support, timing, private strain, compromises, or earlier instability behind that post."
  },
  {
    title: "A real perspective",
    copy: "This may be a real milestone for them, but it is not reliable proof that you have failed. It is one visible moment placed beside the most vulnerable reading of your own timeline."
  },
  {
    title: "Re-anchor",
    copy: "What is true is that you are recovering, paying things down, and creating stability again. That is slower than you wanted, but it is still movement and a more honest frame for your life."
  }
];

const steps = [
  {
    number: "01",
    label: "What you saw",
    copy: "The polished milestone, announcement, post, or update that triggered the reaction."
  },
  {
    number: "02",
    label: "What you felt",
    copy: "The immediate conclusion your brain attached — harsh or absolute as it may be."
  },
  {
    number: "03",
    label: "What's true",
    copy: "Your actual context, constraints, responsibilities, and the real progress you can account for."
  }
];

const distinctions = [
  {
    title: "Not motivation",
    copy: "It does not hype you up or turn pain into a performance speech."
  },
  {
    title: "Not comparison-down",
    copy: "It does not ask you to feel better by finding someone who is doing worse."
  },
  {
    title: "Not therapy",
    copy: "It does not diagnose, process trauma, or substitute for deeper care."
  },
  {
    title: "Just perspective correction",
    copy: "It helps restore proportion when a visible milestone starts acting like a complete truth."
  }
];

export default function HomePage() {
  return (
    <PageShell className="pt-0 pb-32 md:pb-44">

      {/* Hero */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="space-y-10 md:space-y-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground motion-enter">
            Perspective correction
          </p>

          <h1 className="font-serif text-[clamp(3.2rem,8vw,7rem)] tracking-[-0.04em] motion-enter motion-delay-1">
            <span className="block leading-none">See your life</span>
            <span className="mt-4 block leading-none">
              <em className="italic bg-highlight px-3 rounded-lg not-italic" style={{ fontStyle: "italic" }}>more clearly.</em>
            </span>
          </h1>

          <div className="flex flex-col gap-8 motion-enter motion-delay-2 md:flex-row md:items-end md:justify-between">
            <p className="max-w-sm text-base leading-8 text-muted-foreground md:text-[17px]">
              A calm tool for the moment comparison narrows your judgment.
              Separate what was visible from what is actually true.
            </p>
            <Button asChild size="lg" className="shrink-0 self-start md:self-auto">
              <Link href={"/app" as never}>Try a reframe</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden rounded-full bg-highlight py-3">
        <div className="marquee-track flex whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="flex shrink-0 items-center">
              {tickerItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-10 pr-10 text-[11px] uppercase tracking-[0.28em] text-highlight-foreground font-medium"
                >
                  {item}
                  <span className="opacity-40 text-base">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Problem */}
      <section className="py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-2 md:gap-24 md:items-end">
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08] tracking-[-0.03em]">
            We mistake a polished milestone for a complete measure of a life.
          </h2>
          <p className="text-base leading-8 text-muted-foreground md:text-[17px]">
            People compare their full inner reality to someone else&apos;s
            visible highlight and conclude they are behind. The distortion feels
            factual because the milestone is real — but the comparison is built
            on missing context and a harsh edit of your own life.
          </p>
        </div>
      </section>

      {/* Example reframe */}
      <section className="rounded-[2rem] border border-border bg-card p-7 md:p-12">
        <div className="space-y-8">
          <div className="space-y-2 border-b border-border/60 pb-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Example reframe
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              Trigger — a coworker announced a promotion and a new apartment in the same week.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reframeSections.map((section) => (
              <div
                key={section.title}
                className="rounded-[1.4rem] border border-border/70 bg-background p-5 md:p-6"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {section.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground/90 md:text-[15px]">
                  {section.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-36">
        <div className="space-y-12">
          <div className="grid gap-6 md:grid-cols-2 md:gap-20 md:items-end">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                How it works
              </p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.03em]">
                Three inputs.<br />A cleaner frame.
              </h2>
            </div>
            <p className="text-base leading-8 text-muted-foreground md:text-[17px]">
              Nazariya asks for what you saw, what story it triggered, and what
              is actually true about your life. From that, it returns a
              structured reframe in under a minute.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-[1.75rem] border border-border bg-border gap-px md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="space-y-4 bg-card p-7 md:p-8">
                <span className="font-mono text-xs text-muted-foreground/60">
                  {step.number}
                </span>
                <p className="font-serif text-2xl leading-tight tracking-[-0.02em]">
                  {step.label}
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-24 md:py-36">
        <div className="space-y-12">
          <div className="grid gap-6 md:grid-cols-2 md:gap-20 md:items-end">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Perspectives
              </p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.03em]">
                You are not the only one building slowly.
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-8 text-muted-foreground md:text-[17px]">
                Each story names someone building toward something specific. Including one in your reframe is not a reminder that others have it worse — it shows you what your circumstances look like from the outside, as an arrival point someone else is still working toward.
              </p>
              <Button asChild variant="secondary">
                <Link href={"/stories" as never}>Browse all perspectives</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border md:grid-cols-3">
            {stories.slice(0, 3).map((story) => (
              <Link
                key={story.id}
                href={`/app?story=${story.id}` as never}
                className="group flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-secondary/50 md:p-8"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {story.aspirationTheme}
                </p>
                <p className="font-serif text-2xl leading-tight tracking-[-0.02em]">
                  {story.title}
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {story.shortDescription}
                </p>
                <p className="mt-auto text-sm text-foreground/50 transition-colors group-hover:text-foreground">
                  Use for perspective →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Distinctions */}
      <section className="space-y-10">
        <div className="grid gap-6 md:grid-cols-2 md:gap-20 md:items-end">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              What it is and isn&apos;t
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.03em]">
              It stays narrow<br />on purpose.
            </h2>
          </div>
        </div>

        <div className="border-t border-border">
          {distinctions.map((item) => (
            <div
              key={item.title}
              className="grid gap-3 border-b border-border py-7 md:grid-cols-[280px_1fr] md:gap-16 md:items-baseline md:py-8"
            >
              <p className="font-serif text-2xl leading-tight tracking-[-0.02em]">
                {item.title}
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

    </PageShell>
  );
}
