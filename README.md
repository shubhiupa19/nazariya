# Nazariya

**Perspective correction for comparison spirals.**

When a polished milestone narrows your judgment, Nazariya helps you separate what was visible from what is actually true.

---

## What it does

You see someone's announcement — a promotion, a house, a relationship milestone. Your brain turns that one visible moment into a verdict on your own life. Nazariya interrupts that pattern.

You describe what you saw and the story your brain told. The tool returns a structured four-part reframe:

- **What happened** — the visible event, named without distortion
- **What's missing** — the context, timelines, and private realities the comparison skips
- **A real perspective** — a grounded reframe, including whose aspiration mirrors what you already have
- **Re-anchor** — a return to what is concretely true about your own life right now

You choose a tone (Gentle, Direct, or Analytical) and optionally include a perspective from the stories library — grounded accounts of people building toward something you may already have access to.

This is not motivation. It is not comparison-down. It is one narrow intervention: correcting a specific distortion when it is active.

---

## Tech stack

- **Framework**: Next.js 15 App Router, TypeScript, React 19
- **UI**: Tailwind CSS with custom design tokens, shadcn-style components
- **AI**: [Groq](https://groq.com) — `llama-3.3-70b-versatile` via tool-calling for structured JSON output
- **Storage**: Browser `localStorage` — nothing is persisted server-side

**Why Groq instead of OpenAI or another provider:** Groq has a generous free tier that doesn't require a credit card. Since this app is publicly deployed and open to anyone, using OpenAI would mean absorbing unbounded token costs or requiring users to supply their own key. Groq removes that constraint cleanly.

---

## Running locally

```bash
npm install
```

Create `.env.local`:

```
GROQ_API_KEY=your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com). No credit card required.

```bash
npm run dev
```

---

## Guardrails

The system prompt is strict. Nazariya will not:

- Tell you that others have it worse
- Attack or diminish the person you're comparing yourself to
- Use motivational language, therapy clichés, or forced positivity
- Invent people or fabricate case studies
- Shame you for having a strong reaction

Perspective context (the stories library) is framed around aspiration, not deficit — someone is building toward what you have, not suffering beneath it.
