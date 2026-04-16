import { Compass, Eye, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "Name what happened",
    description:
      "Separate the visible event from the story your mind attached to it.",
    icon: Eye
  },
  {
    title: "Restore missing context",
    description:
      "Make room for timelines, tradeoffs, privilege, support, uncertainty, and invisible labor.",
    icon: Compass
  },
  {
    title: "Return to reality",
    description:
      "Generate a reframe that is specific, emotionally grounded, and free of clichés.",
    icon: Sparkles
  },
  {
    title: "Keep boundaries intact",
    description:
      "Careful product guardrails prevent shame, minimization, or attacks on the comparison target.",
    icon: ShieldCheck
  }
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="surface-card rounded-[1.5rem] border border-border/70 bg-card/85 p-6"
        >
          <feature.icon className="mb-4 h-5 w-5 text-muted-foreground" />
          <p className="mb-2 font-medium">{feature.title}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
