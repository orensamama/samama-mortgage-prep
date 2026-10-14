"use client";

import { X } from "lucide-react";
import type { TagConcept } from "@/lib/tagConcepts";

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
          <h3 className="text-lg font-bold text-brand-navy">#{concept.label}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="rounded-full p-1 text-brand-navy/60 hover:bg-brand-navy/5 hover:text-brand-navy"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-6 text-sm leading-7 text-brand-navy/80">
          {concept.description}
        </p>

        <button
          type="button"
          onClick={() => onPracticeTag(concept.tag)}
          className="w-full rounded-full bg-brand-navy py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
        >
          תרגל שאלות בנושא זה בלבד
        </button>
      </div>
    </div>
  );
}
