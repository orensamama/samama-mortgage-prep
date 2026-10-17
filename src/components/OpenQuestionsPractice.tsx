"use client";

import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  ChevronDown,
  Flag,
  LayoutGrid,
  Lightbulb,
} from "lucide-react";
import { openQuestions, type Difficulty } from "@/lib/openQuestions";
import ReportIssueModal from "@/components/ReportIssueModal";

const REPORTS_STORAGE_KEY = "samama-question-reports";

function saveQuestionReport(questionId: string, message: string) {
  const entry = { questionId, message, timestamp: new Date().toISOString() };
  console.log("Open-question report submitted:", entry);
  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(existing) ? [...existing, entry] : [entry];
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable (private browsing, quota, etc.)
  }
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "קל",
  medium: "בינוני",
  hard: "קשה",
};

const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  easy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  hard: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatTagLabel(tag: string): string {
  return tag.replace(/^#/, "").replaceAll("_", " ");
}

export default function OpenQuestionsPractice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(openQuestions.map((q) => q.category))],
    [],
  );

  const pool = useMemo(() => {
    if (!activeCategory) return openQuestions;
    return openQuestions.filter((q) => q.category === activeCategory);
  }, [activeCategory]);

  const total = pool.length;
  const safeIndex = Math.min(currentIndex, Math.max(total - 1, 0));
  const current = pool[safeIndex];

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)));
    setGridOpen(false);
  };

  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setGridOpen(false);
  };

  if (!current) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-brand-navy/10 bg-white p-8 text-center text-brand-navy/60 shadow-sm">
        אין שאלות זמינות בקטגוריה זו.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleCategoryFilter(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeCategory === null
              ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
              : "border-brand-navy/15 bg-white text-brand-navy/70 hover:border-brand-gold"
          }`}
        >
          הכל ({openQuestions.length})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryFilter(category)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === category
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                : "border-brand-navy/15 bg-white text-brand-navy/70 hover:border-brand-gold"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-navy/70">
          <span>
            שאלה {safeIndex + 1} מתוך {total}
          </span>
          <button
            type="button"
            onClick={() => setGridOpen((prev) => !prev)}
            aria-expanded={gridOpen}
            className="flex items-center gap-1.5 rounded-full border border-brand-navy/15 bg-white px-3 py-1 text-xs font-semibold text-brand-navy hover:border-brand-gold hover:text-brand-gold"
          >
            <LayoutGrid size={14} />
            מפת שאלות
            <ChevronDown
              size={14}
              className={`transition-transform ${gridOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-brand-navy/10">
          <div
            className="h-full rounded-full bg-brand-gold transition-all"
            style={{ width: `${((safeIndex + 1) / total) * 100}%` }}
          />
        </div>

        {gridOpen && (
          <div className="mt-3 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
              {pool.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${
                    i === safeIndex
                      ? "border-brand-gold bg-brand-gold/10 text-brand-navy ring-2 ring-brand-gold ring-offset-1"
                      : "border-brand-navy/15 bg-brand-cream text-brand-navy/60 hover:border-brand-gold"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuestionCard key={current.id} question={current} />

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => goTo(safeIndex - 1)}
          disabled={safeIndex === 0}
          className="flex-1 rounded-full border border-brand-navy/20 py-3 text-base font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          שאלה קודמת
        </button>
        <button
          type="button"
          onClick={() => goTo(safeIndex + 1)}
          disabled={safeIndex === total - 1}
          className="flex-1 rounded-full bg-brand-navy py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          שאלה הבאה
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
}: {
  question: (typeof openQuestions)[number];
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-brand-navy/15 bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">
          {question.category}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${DIFFICULTY_CLASS[question.difficulty]}`}
        >
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </div>

      <p className="mb-4 whitespace-pre-line text-base leading-7 text-brand-navy/80">
        {question.scenario}
      </p>

      <h2 className="mb-6 text-lg font-bold leading-8 text-brand-navy">
        {question.question}
      </h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-brand-navy/15 bg-brand-cream px-3 py-1 text-xs font-medium text-brand-navy/70"
          >
            {formatTagLabel(tag)}
          </span>
        ))}
      </div>

      {!showSolution ? (
        <button
          type="button"
          onClick={() => setShowSolution(true)}
          className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
        >
          <Lightbulb size={16} className="shrink-0" />
          הצג פתרון מלא
        </button>
      ) : (
        <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <BookOpenCheck size={16} className="shrink-0 text-brand-gold" />
            <p className="text-sm font-bold text-brand-navy">
              פתרון מלא, שלב אחר שלב
            </p>
          </div>
          <p className="whitespace-pre-line text-sm leading-7 text-brand-navy/80">
            {question.solution}
          </p>
          <button
            type="button"
            onClick={() => setShowSolution(false)}
            className="mt-4 inline-flex rounded-full border border-brand-navy/20 bg-white px-4 py-2 text-xs font-semibold text-brand-navy hover:border-brand-gold hover:text-brand-gold"
          >
            הסתר פתרון
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-navy/40 transition-colors hover:text-brand-gold"
      >
        <Flag size={13} className="shrink-0" />
        מצאת טעות או עדכון רגולטורי? לחץ לדיווח
      </button>

      {reportOpen && (
        <ReportIssueModal
          onClose={() => setReportOpen(false)}
          onSubmit={(message) => saveQuestionReport(question.id, message)}
          contextLabel={`שאלה פתוחה ${question.id}`}
        />
      )}
    </div>
  );
}
