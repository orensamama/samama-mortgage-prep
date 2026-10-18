import { tagConcepts, type TagConcept } from "@/lib/tagConcepts";

// Only glossary-sourced concepts have curated, standalone definitions worth
// surfacing as a cross-reference popover - question-derived tags reuse a
// single question's explanation and read oddly out of context.
const LINKABLE_CONCEPTS: TagConcept[] = [...tagConcepts]
  .filter((c) => c.source === "glossary" && c.term && c.term.length >= 2)
  .sort((a, b) => b.term.length - a.term.length);

const WORD_CHAR = /[א-תa-zA-Z0-9]/;
// The standard single-letter Hebrew prepositions/conjunctions (ו-השימוש
// בכל"ם) attach directly to the next word with no space ("בריבית",
// "לדירה", "מהוראה") - treating that as a word boundary lets the far more
// common prefixed form match too, not just the bare word.
const HEBREW_PREFIX_LETTER = /[ובכלמשה]/;
// A handful of terms collide with an unrelated phrase, but only behind one
// specific prefix letter (e.g. "דרגה ראשונה" - lien priority - inside "קרבת
// משפחה *מ*דרגה ראשונה" - a relative's *degree* of kinship). Every other
// prefix ("שעבוד *ב*דרגה ראשונה") is the term's own ordinary, legitimate use,
// so only that one letter is excluded, not the whole prefix allowance.
const PREFIX_EXCEPTIONS: Record<string, string> = {
  "#שעבוד_דרגה_ראשונה": "מ",
};

export type WikiSegment =
  | { type: "text"; value: string }
  | { type: "term"; value: string; concept: TagConcept };

/**
 * Splits text into plain-text and matched-glossary-term segments. Matches are
 * greedy-longest and require a non-word-char (or string edge) on both sides,
 * so a short term never lights up mid-word (e.g. "דרגה ראשונה" inside
 * "קרבת משפחה מדרגה ראשונה" is correctly skipped).
 */
export function splitWikiSegments(text: string, excludeTag?: string): WikiSegment[] {
  if (!text) return [{ type: "text", value: text }];
  const concepts = excludeTag
    ? LINKABLE_CONCEPTS.filter((c) => c.tag !== excludeTag)
    : LINKABLE_CONCEPTS;
  if (concepts.length === 0) return [{ type: "text", value: text }];

  const segments: WikiSegment[] = [];
  let textStart = 0;
  let i = 0;

  while (i < text.length) {
    let matched: TagConcept | null = null;
    for (const concept of concepts) {
      const term = concept.term;
      if (!text.startsWith(term, i)) continue;
      const prevChar = i > 0 ? text[i - 1] : "";
      const nextChar = text[i + term.length] || "";
      const excludedPrefix = PREFIX_EXCEPTIONS[concept.tag];
      const prevOk =
        !WORD_CHAR.test(prevChar) ||
        (HEBREW_PREFIX_LETTER.test(prevChar) && prevChar !== excludedPrefix);
      if (prevOk && !WORD_CHAR.test(nextChar)) {
        matched = concept;
        break;
      }
    }
    if (matched) {
      if (i > textStart) {
        segments.push({ type: "text", value: text.slice(textStart, i) });
      }
      segments.push({ type: "term", value: matched.term, concept: matched });
      i += matched.term.length;
      textStart = i;
    } else {
      i += 1;
    }
  }
  if (textStart < text.length) {
    segments.push({ type: "text", value: text.slice(textStart) });
  }
  return segments;
}
