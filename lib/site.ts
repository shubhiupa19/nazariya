import type { Route } from "next";

export const navigationItems = [
  { href: "/app" as Route, label: "App" },
  { href: "/stories" as Route, label: "Stories" },
  { href: "/about" as Route, label: "About" }
];

export const siteCopy = {
  reframeSections: [
    {
      title: "What happened",
      preview:
        "You saw a visible outcome and your mind treated it as a verdict on your own timeline."
    },
    {
      title: "What’s missing",
      preview:
        "You do not know the years, support, tradeoffs, luck, losses, or private realities that sit behind the polished moment."
    },
    {
      title: "A real perspective",
      preview:
        "This can be real information without being a complete measure of your worth, direction, or future."
    },
    {
      title: "Re-anchor",
      preview:
        "Return to what is concretely true about your life, your constraints, and the kind of pace your season actually allows."
    }
  ]
};

export const guardrails = [
  "No shaming the user for feeling triggered by comparison.",
  "No minimization through “others have it worse.”",
  "No tearing down the person being compared against.",
  "No fabricated named people or invented case studies.",
  "No motivational clichés, platitudes, or forced positivity."
];
