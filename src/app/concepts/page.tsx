import type { Metadata } from "next";
import Link from "next/link";
import { glossary, tagConcepts } from "@/lib/tagConcepts";

export const metadata: Metadata = {
  title: "מרכז מושגים | Samama Mortgage",
};

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

export default function ConceptsPage() {
  const byCategory = new Map<string, typeof glossary>();
  for (const entry of glossary) {
    const list = byCategory.get(entry.category) ?? [];
    list.push(entry);
    byCategory.set(entry.category, list);
  }

  const extraTags = tagConcepts.filter((c) => c.source === "question");

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <h1 className="mb-2 text-2xl font-bold text-brand-navy sm:text-3xl">
        מרכז מושגים והרחבות רגולטוריות
      </h1>
      <p className="mb-10 text-brand-navy/70">
        מילון מרוכז של {glossary.length} מושגי מפתח בעולם המשכנתאות, מאורגן
        לפי נושאים, עם רקע רגולטורי ודוגמאות מעשיות.
      </p>

      <nav className="mb-10 flex flex-wrap gap-2">
        {CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((category) => (
          <a
            key={category}
            href={`#${encodeURIComponent(category)}`}
            className="rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy/70 hover:border-brand-gold hover:text-brand-gold"
          >
            {category}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-12">
        {CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((category) => (
          <section
            key={category}
            id={encodeURIComponent(category)}
            className="scroll-mt-24"
          >
            <h2 className="mb-4 border-b border-brand-gold/30 pb-2 text-lg font-bold text-brand-navy">
              {category}
            </h2>
            <div className="flex flex-col gap-4">
              {byCategory.get(category)!.map((entry) => (
                <div
                  key={entry.hashtag}
                  className="rounded-xl border border-brand-navy/10 bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex flex-wrap items-baseline gap-2">
                    <p className="font-bold text-brand-navy">{entry.term}</p>
                    <p className="text-xs font-medium text-brand-gold">
                      {entry.hashtag}
                    </p>
                  </div>
                  <p className="mb-3 text-sm leading-7 text-brand-navy/80">
                    {entry.definition}
                  </p>
                  <div className="mb-4 rounded-lg border border-brand-gold/30 bg-brand-gold/10 p-3">
                    <p className="text-sm leading-7 text-brand-navy/80">
                      {entry.note}
                    </p>
                  </div>
                  <Link
                    href={`/practice?tag=${encodeURIComponent(entry.hashtag)}`}
                    className="inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
                  >
                    תרגל שאלות בנושא זה
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}

        {extraTags.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-brand-gold/30 pb-2 text-lg font-bold text-brand-navy">
              נושאי תרגול נוספים
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {extraTags.map((concept) => (
                <Link
                  key={concept.tag}
                  href={`/practice?tag=${encodeURIComponent(concept.tag)}`}
                  className="rounded-xl border border-brand-navy/10 bg-white p-4 shadow-sm transition-shadow hover:border-brand-gold hover:shadow-md"
                >
                  <p className="font-bold text-brand-navy">#{concept.label}</p>
                  <p className="mt-1 text-xs text-brand-navy/60">
                    {concept.questionIds.length} שאלות
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
