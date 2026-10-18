import type { QuestionSource } from "@/lib/questions";

export default function SourceBadge({ source }: { source: QuestionSource }) {
  if (source !== "samama_practice") return null;

  return (
    <span
      title="שאלת תרגול והבנה שנבנתה על ידי Samama Prep"
      aria-label="שאלת תרגול Samama Prep"
      className="absolute -top-2.5 -start-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-navy text-[11px] font-bold text-brand-gold shadow-sm"
    >
      S
    </span>
  );
}
