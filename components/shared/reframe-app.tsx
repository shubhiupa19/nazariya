"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Check,
  Copy,
  History,
  LoaderCircle,
  RotateCcw,
  Trash2,
  X
} from "lucide-react";

import { type Story, getStoryById } from "@/data/stories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Tone = "Gentle" | "Direct" | "Analytical";

type FormValues = {
  whatDidYouSee: string;
  brainStory: string;
  currentTruth: string;
};

type ReframeResponse = {
  whatHappened: string;
  whatsMissing: string;
  realPerspective: string;
  reAnchor: string;
  safetyMode?: boolean;
};

type HistoryEntry = {
  id: string;
  createdAt: string;
  values: FormValues;
  tone: Tone;
  result: ReframeResponse;
  selectedStory: Story | null;
  useSelectedStory: boolean;
};

const toneOptions: Tone[] = ["Gentle", "Direct", "Analytical"];
const historyStorageKey = "nazariya.reframe-history";

const initialValues: FormValues = {
  whatDidYouSee: "",
  brainStory: "",
  currentTruth: ""
};

export function ReframeApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStoryId = searchParams.get("story");
  const querySelectedStory = queryStoryId ? getStoryById(queryStoryId) : undefined;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [tone, setTone] = useState<Tone>("Gentle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>(
    {}
  );
  const [result, setResult] = useState<ReframeResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [restoredStoryUsage, setRestoredStoryUsage] = useState<boolean | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(
    querySelectedStory ?? null
  );
  const [useSelectedStory, setUseSelectedStory] = useState(
    Boolean(querySelectedStory)
  );

  useEffect(() => {
    setSelectedStory(querySelectedStory ?? null);
    setUseSelectedStory(restoredStoryUsage ?? Boolean(querySelectedStory));
    setRestoredStoryUsage(null);
  }, [querySelectedStory, restoredStoryUsage]);

  useEffect(() => {
    setHistoryEntries(readHistoryEntries());
  }, []);

  const isFormComplete = Object.values(values).every(
    (value) => value.trim().length >= 12
  );

  function validateForm(nextValues: FormValues) {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};

    if (nextValues.whatDidYouSee.trim().length < 12) {
      nextErrors.whatDidYouSee = "Add a little more detail about what you saw.";
    }

    if (nextValues.brainStory.trim().length < 12) {
      nextErrors.brainStory = "Name the story clearly so the reframe has something real to work with.";
    }

    if (nextValues.currentTruth.trim().length < 12) {
      nextErrors.currentTruth = "Ground this in the concrete facts of your life right now.";
    }

    return nextErrors;
  }

  function handleValueChange(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setErrorMessage("");
    setCopied(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setCopied(false);

    try {
      const response = await fetch("/api/reframe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          whatDidYouSee: values.whatDidYouSee.trim(),
          brainStory: values.brainStory.trim(),
          currentTruth: values.currentTruth.trim(),
          tone,
          selectedPerspective:
            selectedStory && useSelectedStory
              ? {
                  id: selectedStory.id,
                  title: selectedStory.title,
                  shortDescription: selectedStory.shortDescription,
                  aspirationTheme: selectedStory.aspirationTheme,
                  tags: selectedStory.tags
                }
              : undefined
        })
      });

      const data = (await response.json()) as ReframeResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate perspective right now.");
      }

      setResult(data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setResult(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating perspective."
      );
    }
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    const content = [
      ["What happened", result.whatHappened],
      ["What’s missing", result.whatsMissing],
      ["A real perspective", result.realPerspective],
      ["Re-anchor", result.reAnchor]
    ]
      .map(([title, copy]) => `${title}\n${copy}`)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not copy the output. You can still select and copy it manually.");
    }
  }

  function handleReset() {
    setValues(initialValues);
    setTone("Gentle");
    setErrors({});
    setResult(null);
    setStatus("idle");
    setErrorMessage("");
    setCopied(false);
  }

  function handleClearSelectedStory() {
    setSelectedStory(null);
    setUseSelectedStory(false);
    router.replace("/app" as never);
  }

  function handleSaveReframe() {
    if (!result) {
      return;
    }

    const entry: HistoryEntry = {
      id: createHistoryId(),
      createdAt: new Date().toISOString(),
      values,
      tone,
      result,
      selectedStory,
      useSelectedStory
    };

    const nextHistory = [entry, ...historyEntries].slice(0, 20);
    setHistoryEntries(nextHistory);
    writeHistoryEntries(nextHistory);
  }

  function handleDeleteHistoryEntry(entryId: string) {
    const nextHistory = historyEntries.filter((entry) => entry.id !== entryId);
    setHistoryEntries(nextHistory);
    writeHistoryEntries(nextHistory);
  }

  function handleReopenHistoryEntry(entry: HistoryEntry) {
    setValues(entry.values);
    setTone(entry.tone);
    setErrors({});
    setResult(entry.result);
    setStatus("success");
    setErrorMessage("");
    setCopied(false);
    setSelectedStory(entry.selectedStory);
    setUseSelectedStory(entry.useSelectedStory);
    router.replace("/app" as never);

    if (entry.selectedStory?.id) {
      router.replace(`/app?story=${entry.selectedStory.id}` as never);
      return;
    }

    router.replace("/app" as never);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:gap-10">
      <Card className="rounded-[2rem] border-border bg-card/95">
        <CardContent className="p-6 md:p-8 lg:p-10">
          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 text-center md:space-y-4">
              <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                Main app
              </p>
              <h1 className="font-serif text-4xl tracking-[-0.03em] text-balance sm:text-5xl">
                Get perspective without added noise.
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base md:text-[15px]">
                Describe what you saw, the story it triggered, and the reality
                you are actually living in. Nazariya returns a calmer, more
                accurate frame.
              </p>
            </div>

            <div className="space-y-6">
              <FieldBlock
                fieldId="what-did-you-see"
                label="What did you see?"
                description="Name the post, milestone, conversation, or visible outcome."
                error={errors.whatDidYouSee}
              >
                <Textarea
                  id="what-did-you-see"
                  value={values.whatDidYouSee}
                  onChange={(event) =>
                    handleValueChange("whatDidYouSee", event.target.value)
                  }
                  placeholder="I saw someone my age announce a promotion and a move into a beautiful new apartment."
                  rows={4}
                  aria-describedby="what-did-you-see-description"
                  aria-invalid={Boolean(errors.whatDidYouSee)}
                />
              </FieldBlock>

              <FieldBlock
                fieldId="brain-story"
                label="What story did your brain tell?"
                description="Capture the immediate conclusion, even if it feels harsh."
                error={errors.brainStory}
              >
                <Textarea
                  id="brain-story"
                  value={values.brainStory}
                  onChange={(event) =>
                    handleValueChange("brainStory", event.target.value)
                  }
                  placeholder="It told me I am late, I have wasted time, and I am falling behind everyone I know."
                  rows={4}
                  aria-describedby="brain-story-description"
                  aria-invalid={Boolean(errors.brainStory)}
                />
              </FieldBlock>

              <FieldBlock
                fieldId="current-truth"
                label="What is actually true about your life right now?"
                description="Ground the response in context, constraints, responsibilities, and real progress."
                error={errors.currentTruth}
              >
                <Textarea
                  id="current-truth"
                  value={values.currentTruth}
                  onChange={(event) =>
                    handleValueChange("currentTruth", event.target.value)
                  }
                  placeholder="I am rebuilding after burnout, supporting family, and making steady progress that is slower but real."
                  rows={4}
                  aria-describedby="current-truth-description"
                  aria-invalid={Boolean(errors.currentTruth)}
                />
              </FieldBlock>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Tone</p>
              <div
                className="grid gap-3 sm:grid-cols-3"
                role="radiogroup"
                aria-label="Tone"
              >
                {toneOptions.map((option) => {
                  const isActive = tone === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        setTone(option);
                        setCopied(false);
                      }}
                      className={[
                        "rounded-[1.2rem] border px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isActive
                          ? "border-foreground bg-foreground text-background shadow-[0_14px_30px_rgba(37,29,24,0.12)]"
                          : "border-border bg-background text-foreground hover:-translate-y-0.5 hover:bg-secondary/70"
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMessage ? (
              <div
                className="fade-in-soft flex items-start gap-3 rounded-[1.25rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-foreground"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="leading-6">{errorMessage}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                size="lg"
                className="flex-1 justify-center"
                disabled={status === "loading" || !isFormComplete}
              >
                {status === "loading" ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Get perspective"
                )}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="justify-center"
                onClick={handleReset}
                disabled={status === "loading"}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {selectedStory ? (
          <Card className="border-border bg-background/75">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      Selected perspective
                    </p>
                    <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {selectedStory.aspirationTheme}
                    </span>
                    <span className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">
                      {useSelectedStory ? "Included" : "Not included"}
                    </span>
                  </div>
                  <p className="font-serif text-2xl leading-tight tracking-[-0.02em] text-foreground">
                    {selectedStory.title}
                  </p>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    {selectedStory.shortDescription}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    This context is optional. It can sit quietly in the background
                    as a reminder of a wider human frame, or you can turn it off.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={useSelectedStory ? "secondary" : "default"}
                    onClick={() => setUseSelectedStory((current) => !current)}
                  >
                    {useSelectedStory ? "Ignore context" : "Include context"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleClearSelectedStory}>
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-foreground">Output</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="px-0"
              onClick={handleSaveReframe}
              disabled={!result}
            >
              Save reframe
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="px-0"
              onClick={handleCopy}
              disabled={!result}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy output"}
            </Button>
          </div>
        </div>

        <div aria-live="polite" aria-busy={status === "loading"}>
          {status === "loading" ? <LoadingSkeleton /> : null}

          {status !== "loading" && result ? (
            <div className="fade-in-soft space-y-4">
              {result.safetyMode ? (
                <Card className="border-border bg-background/80">
                  <CardContent className="p-6 md:p-7">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-foreground/80" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          A steadier response is more appropriate here
                        </p>
                        <p className="text-sm leading-7 text-muted-foreground">
                          The language in this entry suggests a level of distress
                          that should be met with care first, not a standard
                          perspective correction.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <OutputCard title="What happened" copy={result.whatHappened} />
                <OutputCard title="What’s missing" copy={result.whatsMissing} />
                <OutputCard title="A real perspective" copy={result.realPerspective} />
                <OutputCard title="Re-anchor" copy={result.reAnchor} />
              </div>
            </div>
          ) : null}

          {status === "idle" && !result ? (
            <Card className="border-dashed bg-background/60">
              <CardContent className="p-6 md:p-7">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Nothing generated yet
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Your reframe will appear here as four calm sections designed
                    to reduce distortion without flattening what you felt.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {status === "error" && !result ? (
            <Card className="border-dashed bg-background/60">
              <CardContent className="p-6 md:p-7">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    No output this time
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Adjust the inputs if needed and try again when you&apos;re ready.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="border-border bg-card/90">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">History</p>
            </div>

            {historyEntries.length === 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">No saved reframes yet</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Saved reframes stay on this device. When you save one, it will
                  appear here with a short preview and date.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {historyEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="surface-card-interactive flex flex-col gap-4 rounded-[1.25rem] border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {formatHistoryDate(entry.createdAt)}
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">
                        {entry.values.whatDidYouSee}
                      </p>
                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {entry.result.realPerspective}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleReopenHistoryEntry(entry)}
                      >
                        Reopen
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDeleteHistoryEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function createHistoryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readHistoryEntries(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(historyStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

function writeHistoryEntries(entries: HistoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(historyStorageKey, JSON.stringify(entries));
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<HistoryEntry>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.tone === "string" &&
    Boolean(candidate.values) &&
    typeof candidate.values?.whatDidYouSee === "string" &&
    typeof candidate.values?.brainStory === "string" &&
    typeof candidate.values?.currentTruth === "string" &&
    Boolean(candidate.result) &&
    typeof candidate.result?.whatHappened === "string" &&
    typeof candidate.result?.whatsMissing === "string" &&
    typeof candidate.result?.realPerspective === "string" &&
    typeof candidate.result?.reAnchor === "string" &&
    typeof candidate.useSelectedStory === "boolean"
  );
}

function formatHistoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Saved recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function FieldBlock({
  fieldId,
  label,
  description,
  error,
  children
}: {
  fieldId: string,
  label: string;
  description: string;
  error?: string;
  children: React.ReactNode;
}) {
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function OutputCard({ title, copy }: { title: string; copy: string }) {
  return (
    <Card className="surface-card-interactive bg-card/95">
      <CardContent className="p-5 md:p-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          {title}
        </p>
        <p className="mt-3 text-sm leading-7 text-foreground/90 md:text-[15px]">
          {copy}
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2" role="status" aria-label="Generating perspective">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="bg-card/90">
          <CardContent className="space-y-4 p-5 md:p-6">
            <div className="pulse-soft h-3 w-28 rounded-full bg-secondary" />
            <div className="space-y-2">
              <div className="pulse-soft h-3 w-full rounded-full bg-secondary/80" />
              <div className="pulse-soft h-3 w-[92%] rounded-full bg-secondary/80" />
              <div className="pulse-soft h-3 w-[76%] rounded-full bg-secondary/80" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
