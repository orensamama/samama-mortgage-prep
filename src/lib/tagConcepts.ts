import { questions } from "@/lib/questions";

export type TagConcept = {
  tag: string;
  label: string;
  description: string;
  questionIds: string[];
};

function formatTagLabel(tag: string): string {
  return tag.replace(/^#/, "").replaceAll("_", " ");
}

export const tagConcepts: TagConcept[] = (() => {
  const map = new Map<string, TagConcept>();

  for (const q of questions) {
    for (const tag of q.tags) {
      const existing = map.get(tag);
      if (existing) {
        existing.questionIds.push(q.id);
      } else {
        map.set(tag, {
          tag,
          label: formatTagLabel(tag),
          description: q.detailedExplanation,
          questionIds: [q.id],
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "he"));
})();

export function getTagConcept(tag: string): TagConcept | undefined {
  return tagConcepts.find((t) => t.tag === tag);
}

export function getQuestionsByTag(tag: string) {
  return questions.filter((q) => q.tags.includes(tag));
}
