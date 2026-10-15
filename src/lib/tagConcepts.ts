import { questions } from "@/lib/questions";
import glossaryData from "@/data/glossary.json";

export type GlossaryEntry = {
  term: string;
  hashtag: string;
  category: string;
  definition: string;
  note: string;
};

export const glossary: GlossaryEntry[] = glossaryData as GlossaryEntry[];

export type TagConcept = {
  tag: string;
  label: string;
  term: string;
  description: string;
  note?: string;
  category?: string;
  questionIds: string[];
  source: "glossary" | "question";
};

function formatTagLabel(tag: string): string {
  return tag.replace(/^#/, "").replaceAll("_", " ");
}

export function getQuestionsByTag(tag: string) {
  return questions.filter((q) => q.tags.includes(tag));
}

const glossaryByTag = new Map(glossary.map((entry) => [entry.hashtag, entry]));

// Fallback index derived from the questions themselves, for any tag used in
// practice that isn't (yet) a formal glossary term.
const derivedByTag = (() => {
  const map = new Map<string, TagConcept>();
  for (const q of questions) {
    for (const tag of q.tags) {
      if (glossaryByTag.has(tag)) continue;
      const existing = map.get(tag);
      if (existing) {
        existing.questionIds.push(q.id);
      } else {
        map.set(tag, {
          tag,
          label: formatTagLabel(tag),
          term: formatTagLabel(tag),
          description: q.detailedExplanation,
          questionIds: [q.id],
          source: "question",
        });
      }
    }
  }
  return map;
})();

export function getTagConcept(tag: string): TagConcept | undefined {
  const entry = glossaryByTag.get(tag);
  if (entry) {
    return {
      tag: entry.hashtag,
      label: formatTagLabel(entry.hashtag),
      term: entry.term,
      description: entry.definition,
      note: entry.note,
      category: entry.category,
      questionIds: getQuestionsByTag(entry.hashtag).map((q) => q.id),
      source: "glossary",
    };
  }
  return derivedByTag.get(tag);
}

// Every concept shown on /concepts: the full glossary, plus any question-only
// tag that doesn't (yet) have a formal glossary entry.
export const tagConcepts: TagConcept[] = [
  ...glossary.map((entry) => getTagConcept(entry.hashtag)!),
  ...Array.from(derivedByTag.values()),
].sort((a, b) => a.label.localeCompare(b.label, "he"));
