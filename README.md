# Nazariya

**Perspective correction for comparison spirals.**

Nazariya helps you separate what was visible from what is true when seeing another person's milestone narrows your judgment.

---

## The Problem

Comparison spirals happen suddenly. You see someone post an achievement, land a job, or reach a milestone. Your brain registers it instantly: *they have something you don't, they're ahead, you're falling behind.* The visible event becomes a complete truth about your pace, your worth, or your circumstances.

The pain is real. But the logic is distorted. You're seeing an outcome without knowing the timeline, the costs, the debt, the family support, the compromises, or what this season is costing them. You're comparing your behind-the-scenes to their highlight.

The problem isn't that you have feelings about it. The problem is that one polished moment starts acting like a verdict on your life.

---

## The Solution

Nazariya walks you through a structured reframe in three minutes.

You input:
- **What you saw**: The visible milestone or announcement that hit.
- **What your brain concluded**: The automatic story you formed (usually something like "I'm behind" or "I'm not enough").
- **What's actually true**: The context you know about your own life and constraints.

Nazariya then returns:
- **What happened**: A clear restatement of the visible event without the distortion.
- **What's missing**: The absent context, unknowns, and asymmetries you're not seeing.
- **A real perspective**: A sober, believable reinterpretation that doesn't minimize your feeling but does correct the conclusion.
- **Re-anchor**: A return to the concrete truth of your present life, your actual progress, and what matters for you right now.

You choose the tone that fits: Gentle (for tender moments), Direct (for cutting through the noise), or Analytical (for getting the internals clear).

---

## Why It Matters

Comparison spirals aren't just uncomfortable. They distort decision-making, erode confidence, and create false urgency. You start making choices based on a story that isn't true—rushing into things you're not ready for, abandoning plans that still matter, or internalizing shame about a pace that's actually fine.

Correcting perspective isn't about feeling better. It's about thinking better.

When you can separate observation from inference, visible outcome from private timeline, and other people's constraints from your own, you make better decisions. You grieve what genuinely matters without bleeding your grief onto a false timeline. You move at your actual pace with clearer judgment about why.

---

## How It Works

### The Input
You describe the moment: what you saw, what conclusion your brain attached, and what you know to be true about your own situation. You can choose to reference one of the built-in perspectives (stories of real people building their lives under real constraints) if it resonates, or you can work from your own context alone.

### The Processing
The reframe request goes to OpenAI with a carefully designed prompt that keeps the response honest. The system prompt is strict: no toxic positivity, no therapy speak, no Instagram-style inspiration. It writes like a thoughtful friend with good judgment, not like a chatbot or a life coach.

The response is structured into exactly four sections with specific purposes. Each section is brief and free of filler. The tone you selected shapes how these sections sound, but the structure and rigor stay constant.

### The Storage
Your reframes are saved locally in browser storage. You can build a history of moments you've processed, re-read the perspective you built at a clearer time, or see patterns in what trips you up. Nothing is sent to the server except the reframe request itself.

---

## What Makes It Different

**Not motivation.** Nazariya doesn't hype you up or turn your pain into a performance speech. You don't leave feeling inspired—you leave thinking more clearly.

**Not comparison-down.** It doesn't ask you to feel better by finding someone who's doing worse. It doesn't diminish the other person or find comfort in their struggles.

**Not therapy.** It doesn't diagnose, process trauma, or substitute for deeper care. If you need actual support, it points you elsewhere.

**Just perspective correction.** It restores proportion when a visible milestone stops acting like a complete truth and starts being one data point among many.

The tool is deliberately modest. It's not trying to heal you or fix your judgment permanently. It's a calm intervention for a specific moment—the moment when comparison has narrowed your thinking and you need to see more clearly right now.

---

## Technical Overview

**Architecture:**
- **Frontend**: Next.js 15 App Router with TypeScript, React 19
- **UI**: Custom shadcn-style components, Tailwind CSS, Lucide icons
- **Styling**: Tailwind CSS with custom design tokens for calm, readable design
- **AI**: OpenAI API on the server with strict prompt engineering and JSON schema validation
- **Storage**: Browser localStorage for reframe history and drafts

**Key Implementation Details:**
- The reframe request goes through a rigorous system prompt that enforces tone, structure, and safety guardrails
- JSON schema validation ensures output consistency: four required sections, minimum/maximum length per section
- Tone guidance is injected into the system prompt so Direct, Gentle, and Analytical responses reflect real differences in how the message lands
- Client-side state management for form values, history, and UI states (loading, error, success)
- All story content is local JSON, no external data fetches required

**Design Philosophy:**
- No animations that distract. Motion is intentional and supportive.
- No dark patterns. The tool is here when you need it, not demanding attention.
- Accessible typography and color contrast. The content is meant to be reread at quiet moments.
- Response times matter—the reframe should feel immediate enough to land as useful, not delayed enough to feel mechanical.

---

## Current State

The core scaffold is built and ready for completion:
- Landing page with clear positioning
- Main app experience (form, reframe display, history)
- Stories featuring real people building their lives under real constraints
- About page explaining the tool's philosophy
- Placeholder API route ready to connect to OpenAI

---

## Next Implementation Steps

1. **Form completion**: Add full form state management, client-side validation, and local draft persistence so users can start a reframe and return to it later.

2. **API connection**: Connect the server route to OpenAI with the reframe prompt, response parsing, and error handling. Implement retry logic and clear error messages.

3. **Save and retrieval**: Implement full localStorage flows for persisting reframes, adding metadata (timestamps, tone, success/failure), and allowing users to revisit or share saved reframes.

4. **UI refinement**: Add loading states, error states, empty history states, and edge case handling. Polish the transitions between form, processing, and display.

5. **Safety and limits**: Implement rate limiting on the API, content moderation checks, and safeguards against jailbreaks or requests that fall outside the tool's scope.

6. **Testing and fixtures**: Create test fixtures for the reframe prompt and validate that output is consistent, on-brand, and structurally sound across different inputs and tones.

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
# Add OPENAI_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Design Principles

- **Calm over urgent**: The tool should never pressure or nudge. It's available when you need it.
- **Clear over clever**: Language should be direct and familiar, not clever or stylized.
- **Honest over kind**: The reframe might be hard to read. It should be true first, kind second.
- **Local over dependent**: Your data stays local. You're not giving this tool access to your full history or building a profile.
- **Modest over transformative**: This is not a solution to comparison spirals forever. It's a clear moment when you're spiraling right now.
