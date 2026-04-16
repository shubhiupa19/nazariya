import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { StoryLibrary } from "@/components/shared/story-library";

export default function StoriesPage() {
  return (
    <PageShell className="gap-10 pb-20 pt-10 md:pt-14">
      <SectionHeading
        eyebrow="Stories"
        title="Grounded lives, seen through aspiration rather than spectacle."
        description="These stories are local reference points for perspective. They stay specific and respectful, focusing on what people are trying to build, protect, or reach toward rather than turning them into pity objects."
      />
      <StoryLibrary />
    </PageShell>
  );
}
