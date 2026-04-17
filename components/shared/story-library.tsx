"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { stories, storyThemes } from "@/data/stories";

const allThemesLabel = "All";

export function StoryLibrary() {
  const [activeTheme, setActiveTheme] = useState(allThemesLabel);

  const visibleStories = useMemo(() => {
    if (activeTheme === allThemesLabel) {
      return stories;
    }

    return stories.filter((story) => story.aspirationTheme === activeTheme);
  }, [activeTheme]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {[allThemesLabel, ...storyThemes].map((theme) => {
          const isActive = activeTheme === theme;

          return (
            <button
              key={theme}
              type="button"
              onClick={() => setActiveTheme(theme)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-highlight bg-highlight text-highlight-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary/70"
              ].join(" ")}
              aria-pressed={isActive}
            >
              {theme}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleStories.map((story) => (
          <article
            key={story.id}
            className="surface-card flex h-full flex-col rounded-[1.75rem] border border-border/70 bg-card/90 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {story.aspirationTheme}
              </p>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {story.tags[0]}
              </span>
            </div>

            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-[-0.02em]">
              {story.title}
            </h2>

            <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
              {story.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href={`/app?story=${story.id}` as never}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Use for perspective
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
