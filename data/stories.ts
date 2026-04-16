import storiesJson from "@/data/stories.json";

export type Story = {
  id: string;
  title: string;
  shortDescription: string;
  aspirationTheme: string;
  tags: string[];
};

export const stories = storiesJson as Story[];

export const storyThemes = Array.from(
  new Set(stories.map((story) => story.aspirationTheme))
).sort((left, right) => left.localeCompare(right));

export function getStoryById(id: string) {
  return stories.find((story) => story.id === id);
}
