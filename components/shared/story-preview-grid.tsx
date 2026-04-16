import Link from "next/link";

import { stories } from "@/data/stories";

export function StoryPreviewGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stories.slice(0, 3).map((story) => (
        <article
          key={story.id}
          className="surface-card rounded-[1.5rem] border border-border/70 bg-card/85 p-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {story.aspirationTheme}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-0.02em]">
            {story.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {story.shortDescription}
          </p>
          <Link
            href="/stories"
            className="mt-6 inline-flex text-sm text-foreground underline-offset-4 hover:underline"
          >
            Read story
          </Link>
        </article>
      ))}
    </div>
  );
}
