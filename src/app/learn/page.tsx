import type { Metadata } from "next";
import Link from "next/link";
import {
  Banknote,
  ChevronLeft,
  Percent,
  Receipt,
  Ruler,
  Scale,
  TrendingUp,
} from "lucide-react";
import { LEARN_MODULES, type LearnModule } from "@/lib/learnModules";

export const metadata: Metadata = {
  title: "מרכז ידע וקורס מקצועי | Samama Mortgage",
};

const ICONS: Record<LearnModule["icon"], typeof Scale> = {
  scale: Scale,
  percent: Percent,
  banknote: Banknote,
  "trending-up": TrendingUp,
  ruler: Ruler,
  receipt: Receipt,
};

export default function LearnIndexPage() {
  const sorted = [...LEARN_MODULES].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-gold">
        מרכז ידע
      </p>
      <h1 className="mb-3 text-2xl font-bold text-brand-navy sm:text-3xl">
        הקורס המקצועי של Samama Mortgage
      </h1>
      <p className="mb-10 max-w-2xl text-brand-navy/70">
        {sorted.length} פרקי לימוד מעמיקים, כתובים בשיטת פיינמן: הסבר משפטי
        מדויק עם מראה מקום להוראות בנק ישראל העדכניות, פירוק לשפה פשוטה
        ואנלוגיות מעולם הייעוץ, דוגמאות מספריות שלב-אחר-שלב, וטבלאות ותרשימים
        להשוואה ויזואלית נקייה.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sorted.map((mod) => {
          const Icon = ICONS[mod.icon];
          return (
            <Link
              key={mod.slug}
              href={`/learn/${mod.slug}`}
              className="group flex flex-col rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy group-hover:bg-brand-gold/15 group-hover:text-brand-gold">
                  <Icon size={20} />
                </span>
                <span className="text-xs font-bold text-brand-navy/40">
                  פרק {mod.order}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-bold text-brand-navy">
                {mod.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-7 text-brand-navy/70">
                {mod.summary}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gold">
                למדו את הפרק
                <ChevronLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
