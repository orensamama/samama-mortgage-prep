"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { tagConcepts, type TagConcept } from "@/lib/tagConcepts";
import { getLearnModuleSlugForCategory } from "@/lib/learnModules";

const CATEGORY_ORDER = [
  "מושגי יסוד",
  "ריביות ומסלולים",
  "הצמדה ומדדים",
  "שיטות החזר, גרייס ובלון",
  "יחס מימון, יחס החזר ועומס חוב",
  "מטרת ההלוואה וסוגי מימון",
  "תהליך האישור והביצוע",
  "שמאות",
  "טאבו ורישום זכויות",
  "מושע, הסכם שיתוף ופרצלציה",
  "שעבודים ובטוחות",
  "סילוק, מכתב כוונות ופירעון מוקדם",
  "מחזור וגרירת משכנתא",
  "ביטוחים",
  "אשראי ויכולת החזר",
  "רכישה מקבלן",
  "עלויות ומסים נלווים",
  "רגולציה - הוראה 329 והלוואת מיגון",
];

const OTHER_CATEGORY = "נושאי תרגול נוספים";

function groupByCategory(concepts: TagConcept[]) {
  const map = new Map<string, TagConcept[]>();
  for (const concept of concepts) {
    const category = concept.category ?? OTHER_CATEGORY;
    const list = map.get(category) ?? [];
    list.push(concept);
    map.set(category, list);
  }
  return map;
}

export default function ConceptsExplorer() {
  const [query, setQuery] = useState("");
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  const byCategory = useMemo(() => groupByCategory(tagConcepts), []);
  const categories = useMemo(
    () =>
      [...CATEGORY_ORDER, OTHER_CATEGORY].filter((cat) => byCategory.has(cat)),
    [byCategory],
  );

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return tagConcepts.filter((c) =>
      c.label.toLowerCase().includes(trimmedQuery),
    );
  }, [isSearching, trimmedQuery]);

  const visibleCategories = useMemo(() => {
    if (activeCategory) return categories.filter((c) => c === activeCategory);
    return categories;
  }, [categories, activeCategory]);

  const handleToggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <h1 className="mb-2 text-2xl font-bold text-brand-navy sm:text-3xl">
        מרכז מושגים והרחבות רגולטוריות
      </h1>
      <p className="mb-8 text-brand-navy/70">
        מילון מרוכז של {tagConcepts.length} מושגי מפתח פעילים בעולם המשכנתאות -
        לכל מושג כאן יש לפחות שאלת תרגול אחת. לחצו על מושג כדי לפתוח הגדרה,
        רקע רגולטורי ותרגול ממוקד.
      </p>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפשו מושג, לדוגמה: יחס החזר, הקצאת הון, מכתב כוונות..."
            className="w-full rounded-full border border-brand-navy/15 bg-white py-3 pe-11 ps-5 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="נקה חיפוש"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-navy/40 hover:bg-brand-navy/5 hover:text-brand-navy"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCategoryPanelOpen((prev) => !prev)}
          aria-expanded={categoryPanelOpen}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-navy/15 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold"
        >
          <SlidersHorizontal size={16} />
          סינון לפי קטגוריות
          <ChevronDown
            size={16}
            className={`transition-transform ${categoryPanelOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {categoryPanelOpen && (
        <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleToggleCategory(category)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : "border-brand-navy/15 bg-white text-brand-navy/70 hover:border-brand-gold hover:text-brand-gold"
                }`}
              >
                {category}
                <span className="ms-1 text-brand-navy/40">
                  ({byCategory.get(category)!.length})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {isSearching ? (
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="mb-4 border-b border-brand-gold/30 pb-2 text-lg font-bold text-brand-navy">
              תוצאות חיפוש ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className="flex flex-col gap-3">
                {searchResults.map((concept) => (
                  <ConceptAccordionItem
                    key={concept.tag}
                    concept={concept}
                    isOpen={expandedTag === concept.tag}
                    onToggle={() =>
                      setExpandedTag((prev) =>
                        prev === concept.tag ? null : concept.tag,
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-navy/60">
                לא נמצאו מושגים התואמים את החיפוש.
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {visibleCategories.map((category) => (
            <section key={category} className="scroll-mt-24">
              <h2 className="mb-4 border-b border-brand-gold/30 pb-2 text-lg font-bold text-brand-navy">
                {category}
              </h2>
              <div className="flex flex-col gap-3">
                {byCategory.get(category)!.map((concept) => (
                  <ConceptAccordionItem
                    key={concept.tag}
                    concept={concept}
                    isOpen={expandedTag === concept.tag}
                    onToggle={() =>
                      setExpandedTag((prev) =>
                        prev === concept.tag ? null : concept.tag,
                      )
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ConceptAccordionItem({
  concept,
  isOpen,
  onToggle,
}: {
  concept: TagConcept;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-navy/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
      >
        <span className="font-bold text-brand-navy">{concept.term}</span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-brand-navy/40">
            {concept.questionIds.length} שאלות
          </span>
          <ChevronDown
            size={18}
            className={`text-brand-navy/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-brand-navy/10 px-5 pb-5 pt-4">
          <p className="mb-3 text-sm leading-7 text-brand-navy/80">
            {concept.description}
          </p>
          {concept.note && (
            <div className="mb-4 rounded-lg border border-brand-gold/30 bg-brand-gold/10 p-3">
              <p className="text-sm leading-7 text-brand-navy/80">
                {concept.note}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {(() => {
              const moduleSlug = getLearnModuleSlugForCategory(concept.category);
              return moduleSlug ? (
                <Link
                  href={`/learn/${moduleSlug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/20"
                >
                  למד עוד בקורס המקצועי
                  <ArrowLeft size={14} />
                </Link>
              ) : null;
            })()}
            <Link
              href={`/practice?tag=${encodeURIComponent(concept.tag)}`}
              className="inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
            >
              תרגל שאלות בנושא זה
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
