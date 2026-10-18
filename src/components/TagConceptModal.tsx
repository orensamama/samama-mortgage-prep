"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import type { TagConcept } from "@/lib/tagConcepts";
import { getLearnModuleSlugForCategory } from "@/lib/learnModules";
import WikiText from "@/components/WikiText";

export default function TagConceptModal({
  concept,
  onClose,
  onPracticeTag,
}: {
  concept: TagConcept;
  onClose: () => void;
  onPracticeTag: (tag: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={concept.label}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-brand-navy">{concept.term}</h3>
            {concept.category && (
              <p className="text-xs font-medium text-brand-gold">
                {concept.category}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="rounded-full p-1 text-brand-navy/60 hover:bg-brand-navy/5 hover:text-brand-navy"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm leading-7 text-brand-navy/80">
          <WikiText text={concept.description} excludeTag={concept.tag} />
        </p>

        {concept.note && (
          <div className="mb-6 rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-3">
            <p className="text-sm leading-7 text-brand-navy/80">
              <WikiText text={concept.note} excludeTag={concept.tag} />
            </p>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2">
          {(() => {
            const moduleSlug = getLearnModuleSlugForCategory(concept.category);
            return moduleSlug ? (
              <Link
                href={`/learn/${moduleSlug}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/20"
              >
                למד עוד בקורס המקצועי
                <ArrowLeft size={14} />
              </Link>
            ) : null;
          })()}
          <button
            type="button"
            onClick={() => onPracticeTag(concept.tag)}
            className="w-full rounded-full bg-brand-navy py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            תרגל שאלות בנושא זה בלבד
          </button>
        </div>
      </div>
    </div>
  );
}
