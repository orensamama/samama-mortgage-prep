"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Lightbulb, RotateCcw, X, XCircle } from "lucide-react";
import { questions, type Difficulty } from "@/lib/questions";
import { getQuestionsByTag, getTagConcept } from "@/lib/tagConcepts";
import TagConceptModal from "@/components/TagConceptModal";

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

export default function PracticeSuite() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag");

  const [activeTag, setActiveTag] = useState<string | null>(initialTag);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  const [modalTag, setModalTag] = useState<string | null>(null);

  const pool = useMemo(() => {
    if (!activeTag) return questions;
    const filtered = getQuestionsByTag(activeTag);
    return filtered.length > 0 ? filtered : questions;
  }, [activeTag]);

  const total = pool.length;
  const current = pool[currentIndex];
  const isLastQuestion = currentIndex === total - 1;
  const activeTagLabel = activeTag ? formatTagLabel(activeTag) : null;

  const resetProgress = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setShowDetailed(false);
  };

  const handleSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    if (optionIndex === current.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowDetailed(false);
  };

  const handleRestart = () => {
    resetProgress();
  };

  const handleClearFilter = () => {
    setActiveTag(null);
    resetProgress();
  };

  const handlePracticeTag = (tag: string) => {
    setActiveTag(tag);
    setModalTag(null);
    resetProgress();
  };

  const modalConcept = modalTag ? getTagConcept(modalTag) : undefined;

  if (finished) {
    const percentage = Math.round((score / total) * 100);
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-brand-gold">סיימתם את התרגול</p>
        <p className="mt-4 text-6xl font-bold text-brand-navy">{percentage}%</p>
        <p className="mt-3 text-lg text-brand-navy/70">
          {score} תשובות נכונות מתוך {total}
        </p>
        <button
          type="button"
          onClick={handleRestart}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
        >
          <RotateCcw size={18} />
          התחל תרגול מחדש
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {activeTagLabel && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-sm text-brand-navy">
          <span>
            מציג שאלות בנושא: <strong>#{activeTagLabel}</strong>
          </span>
          <button
            type="button"
            onClick={handleClearFilter}
            aria-label="הסר סינון"
            className="rounded-full p-1 hover:bg-brand-navy/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-navy/70">
          <span>
            שאלה {currentIndex + 1} מתוך {total}
          </span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-brand-navy/10">
          <div
            className="h-full rounded-full bg-brand-gold transition-all"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand-navy/15 bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">
            {current.category}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${DIFFICULTY_CLASS[current.difficulty]}`}
          >
            {DIFFICULTY_LABEL[current.difficulty]}
          </span>
        </div>

        <h2 className="mb-4 text-xl font-bold leading-8 text-brand-navy">
          {current.question}
        </h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {current.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setModalTag(tag)}
              className="rounded-full border border-brand-navy/15 bg-brand-cream px-3 py-1 text-xs font-medium text-brand-navy/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              #{formatTagLabel(tag)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {current.options.map((option, index) => {
            const isCorrectOption = index === current.correctAnswer;
            const isSelectedOption = index === selectedAnswer;
            const showResult = selectedAnswer !== null;

            let stateClass =
              "border-brand-navy/15 bg-white hover:border-brand-gold hover:bg-brand-gold/5";
            if (showResult && isCorrectOption) {
              stateClass = "border-emerald-400 bg-emerald-50 text-emerald-800";
            } else if (showResult && isSelectedOption && !isCorrectOption) {
              stateClass = "border-rose-400 bg-rose-50 text-rose-800";
            } else if (showResult) {
              stateClass = "border-brand-navy/10 bg-white text-brand-navy/40";
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                disabled={showResult}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-base font-medium text-brand-navy transition-colors disabled:cursor-default ${stateClass}`}
              >
                <span>{option}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                )}
                {showResult && isSelectedOption && !isCorrectOption && (
                  <XCircle size={20} className="shrink-0 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-6 rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-4">
            <p className="mb-1 text-sm font-bold text-brand-navy">הסבר</p>
            <p className="text-sm leading-7 text-brand-navy/80">
              {current.explanation}
            </p>

            <button
              type="button"
              onClick={() => setShowDetailed((prev) => !prev)}
              aria-expanded={showDetailed}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-navy/20 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              <Lightbulb size={16} className="shrink-0 text-brand-gold" />
              אני לא מכיר מספיק את החומר - הרחב לי
            </button>

            {showDetailed && (
              <div className="mt-4 rounded-xl border border-brand-navy/15 bg-white p-4">
                <p className="mb-2 text-sm font-bold text-brand-navy">
                  הרחבה מעמיקה
                </p>
                <p className="whitespace-pre-line text-sm leading-7 text-brand-navy/80">
                  {current.detailedExplanation}
                </p>
              </div>
            )}
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-6 w-full rounded-full bg-brand-navy py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            {isLastQuestion ? "סיום וצפייה בתוצאות" : "השאלה הבאה"}
          </button>
        )}
      </div>

      {modalConcept && (
        <TagConceptModal
          concept={modalConcept}
          onClose={() => setModalTag(null)}
          onPracticeTag={handlePracticeTag}
        />
      )}
    </div>
  );
}
