import type { Metadata } from "next";
import Link from "next/link";
import { tagConcepts } from "@/lib/tagConcepts";

export const metadata: Metadata = {
  title: "מרכז מושגים | Samama Mortgage",
};

export default function ConceptsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <h1 className="mb-2 text-2xl font-bold text-brand-navy sm:text-3xl">
        מרכז מושגים והרחבות רגולטוריות
      </h1>
      <p className="mb-8 text-brand-navy/70">
        מילון מרוכז של מושגי המפתח במבחן, עם רקע רגולטורי ודוגמאות מעשיות.
      </p>

      <div className="flex flex-col gap-4">
        {tagConcepts.map((t) => (
          <div
            key={t.tag}
            className="rounded-xl border border-brand-navy/10 bg-white p-5 shadow-sm"
          >
            <p className="mb-2 font-bold text-brand-navy">#{t.label}</p>
            <p className="mb-4 text-sm leading-7 text-brand-navy/80">
              {t.description}
            </p>
            <Link
              href={`/practice?tag=${encodeURIComponent(t.tag)}`}
              className="inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
            >
              תרגל שאלות בנושא זה בלבד
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
