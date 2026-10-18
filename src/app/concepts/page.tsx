import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import ConceptsExplorer from "@/components/ConceptsExplorer";

export const metadata: Metadata = {
  title: "מילון משכנתאות | Samama Mortgage",
};

export default function ConceptsPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-6 pt-10">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:bg-brand-gold/20"
        >
          <BookOpen size={16} className="shrink-0 text-brand-gold" />
          רוצים ללמוד לעומק? עברו למרכז הידע והקורס המקצועי
        </Link>
      </div>
      <Suspense fallback={null}>
        <ConceptsExplorer />
      </Suspense>
    </>
  );
}
