"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { splitWikiSegments } from "@/lib/wikiLink";
import type { TagConcept } from "@/lib/tagConcepts";

function trimToPreview(text: string, maxLen = 160): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export default function WikiText({
  text,
  excludeTag,
  className,
}: {
  text: string;
  excludeTag?: string;
  className?: string;
}) {
  const segments = splitWikiSegments(text, excludeTag);

  if (segments.every((s) => s.type === "text")) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.value}</span>
        ) : (
          <WikiTerm key={i} concept={seg.concept} label={seg.value} />
        ),
      )}
    </span>
  );
}

function WikiTerm({ concept, label }: { concept: TagConcept; label: string }) {
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setOpen(true), 200);
  };
  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <span ref={containerRef} className="relative inline">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={open}
        className="underline decoration-dotted decoration-brand-gold/60 underline-offset-2 transition-colors hover:text-brand-gold"
      >
        {label}
      </button>

      {open && (
        <span
          role="dialog"
          aria-label={concept.term}
          className="absolute z-30 mt-2 w-64 rounded-xl border border-brand-gold/30 bg-white p-3 text-start shadow-lg sm:w-72"
          style={{ insetInlineStart: 0, top: "100%" }}
        >
          <span className="mb-1.5 flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-brand-navy">{concept.term}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגור"
              className="shrink-0 rounded-full p-0.5 text-brand-navy/40 hover:bg-brand-navy/5 hover:text-brand-navy"
            >
              <X size={14} />
            </button>
          </span>
          <span className="block text-xs leading-6 text-brand-navy/80">
            {trimToPreview(concept.description)}
          </span>
          <Link
            href={`/concepts?q=${encodeURIComponent(concept.term)}`}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-gold hover:underline"
          >
            קראו עוד במילון המלא
            <ArrowLeft size={12} />
          </Link>
        </span>
      )}
    </span>
  );
}
