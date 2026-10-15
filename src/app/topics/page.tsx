import type { Metadata } from "next";
import Link from "next/link";
import { tagConcepts } from "@/lib/tagConcepts";

export const metadata: Metadata = {
  title: "תרגול לפי נושאים | Samama Mortgage",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <h1 className="mb-2 text-2xl font-bold text-brand-navy sm:text-3xl">
        תרגול ממוקד לפי נושאים
      </h1>
      <p className="mb-8 text-brand-navy/70">
        בחרו נושא כדי לתרגל אך ורק את השאלות הקשורות אליו.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tagConcepts.map((t) => (
          <Link
            key={t.tag}
            href={`/practice?tag=${encodeURIComponent(t.tag)}`}
            className="rounded-xl border border-brand-navy/10 bg-white p-4 shadow-sm transition-shadow hover:border-brand-gold hover:shadow-md"
          >
            <p className="font-bold text-brand-navy">{t.label}</p>
            <p className="mt-1 text-xs text-brand-navy/60">
              {t.questionIds.length} שאלות
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
