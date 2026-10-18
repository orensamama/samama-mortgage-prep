"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Flag,
  HelpCircle,
  LayoutGrid,
  Lightbulb,
  RotateCcw,
  Shuffle,
  ThumbsUp,
  X,
  XCircle,
} from "lucide-react";
import { questions, type Difficulty, type Question } from "@/lib/questions";
import { getQuestionsByTag, getTagConcept } from "@/lib/tagConcepts";
import TagConceptModal from "@/components/TagConceptModal";
import ReportIssueModal from "@/components/ReportIssueModal";
import SourceBadge from "@/components/SourceBadge";
import WikiText from "@/components/WikiText";

const REPORTS_STORAGE_KEY = "samama-question-reports";
const SHUFFLE_STORAGE_KEY = "samama-shuffle-pref";

type ConfidenceLevel = "confident" | "unsure" | "unknown";

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function saveQuestionReport(questionId: string, message: string) {
  const entry = { questionId, message, timestamp: new Date().toISOString() };
  console.log("Question report submitted:", entry);
  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(existing) ? [...existing, entry] : [entry];
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable (private browsing, quota, etc.) - the
    // console.log above already preserves the report for this session.
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

export default function PracticeSuite() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag");

  const [activeTag, setActiveTag] = useState<string | null>(initialTag);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SHUFFLE_STORAGE_KEY);
      if (stored === "true") {
        // Reading the saved preference from localStorage on mount - an external
        // system sync, not derived state, so setState here is intentional.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShuffleEnabled(true);
        setShuffleSeed((prev) => prev + 1);
      }
    } catch {
      // localStorage may be unavailable (private browsing, quota, etc.)
    }
  }, []);

  // The base set of questions for the active filter. When a tag is selected
  // but it matches no questions, this is an empty array - the UI shows a
  // dedicated "no questions" message instead of silently falling back to the
  // full bank (a prior bug: filtering by topic could show all 210 questions).
  const basePool = useMemo(() => {
    if (!activeTag) return questions;
    return getQuestionsByTag(activeTag);
  }, [activeTag]);

  const orderedPool = useMemo(() => {
    return shuffleEnabled ? shuffleArray(basePool) : basePool;
    // shuffleSeed is a trigger to re-shuffle on toggle/mount; its value itself is unused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePool, shuffleEnabled, shuffleSeed]);

  // The live session queue - starts as a copy of orderedPool, but questions
  // marked "לא יודע" are appended to the end so they resurface later in the
  // same session. Entirely in-memory: a refresh or a new practice session
  // (tag change, shuffle toggle, restart) resets it from orderedPool.
  const [queue, setQueue] = useState<Question[]>(orderedPool);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(orderedPool.length).fill(null),
  );
  const [confidence, setConfidence] = useState<(ConfidenceLevel | null)[]>(
    Array(orderedPool.length).fill(null),
  );
  const [finished, setFinished] = useState(false);
  const [modalTag, setModalTag] = useState<string | null>(null);
  const [gridOpen, setGridOpen] = useState(false);

  const total = queue.length;
  const current: Question | undefined = queue[currentIndex];
  const isLastQuestion = currentIndex === total - 1;
  const activeTagLabel = activeTag ? formatTagLabel(activeTag) : null;
  const selectedAnswer = answers[currentIndex] ?? null;
  const currentConfidence = confidence[currentIndex] ?? null;
  const answeredCount = answers.filter((a) => a !== null).length;

  const resetProgress = (nextPool: Question[]) => {
    setQueue(nextPool);
    setCurrentIndex(0);
    setAnswers(Array(nextPool.length).fill(null));
    setConfidence(Array(nextPool.length).fill(null));
    setFinished(false);
    setGridOpen(false);
  };

  const handleSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setAnswers((prev) => {
      const next = prev.length === total ? [...prev] : Array(total).fill(null);
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleMarkConfidence = (level: ConfidenceLevel) => {
    setConfidence((prev) => {
      const next = prev.length === total ? [...prev] : Array(total).fill(null);
      next[currentIndex] = level;
      return next;
    });
    if (level === "unknown" && current) {
      setQueue((prev) => [...prev, current]);
      setAnswers((prev) => [...prev, null]);
      setConfidence((prev) => [...prev, null]);
    }
  };

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)));
    setGridOpen(false);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setFinished(true);
      return;
    }
    goTo(currentIndex + 1);
  };

  const handlePrevious = () => {
    goTo(currentIndex - 1);
  };

  const handleRestart = () => {
    resetProgress(orderedPool);
  };

  const handleClearFilter = () => {
    setActiveTag(null);
  };

  const handlePracticeTag = (tag: string) => {
    setActiveTag(tag);
    setModalTag(null);
  };

  const handleToggleShuffle = () => {
    setShuffleEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SHUFFLE_STORAGE_KEY, String(next));
      } catch {
        // localStorage may be unavailable (private browsing, quota, etc.)
      }
      return next;
    });
    setShuffleSeed((prev) => prev + 1);
  };

  // A new topic filter, shuffle toggle, or re-shuffle produces a new
  // orderedPool identity - start a fresh session queue from it so no answer,
  // confidence mark, or requeue leaks from the previous filter/session.
  useEffect(() => {
    // Resetting the session queue to sync with a new filter/shuffle selection
    // is an intentional external-trigger sync, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetProgress(orderedPool);
  }, [orderedPool]);

  const modalConcept = modalTag ? getTagConcept(modalTag) : undefined;

  if (basePool.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-brand-navy">
          לא נמצאו שאלות בנושא &quot;{activeTagLabel}&quot;
        </p>
        <p className="mt-3 text-sm text-brand-navy/60">
          ייתכן שטרם נוספו שאלות תרגול לנושא זה. נסו לבחור נושא אחר או לחזור
          למאגר המלא.
        </p>
        <button
          type="button"
          onClick={handleClearFilter}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
        >
          <X size={18} />
          חזרה למאגר המלא
        </button>
      </div>
    );
  }

  if (finished) {
    // Score on the latest attempt per unique question only - a question
    // retried after "לא יודע" counts once, by its most recent answer.
    const latestById = new Map<string, { question: Question; answer: number | null }>();
    queue.forEach((q, i) => {
      latestById.set(q.id, { question: q, answer: answers[i] ?? null });
    });
    const uniqueResults = [...latestById.values()];
    const score = uniqueResults.filter(
      (r) => r.answer !== null && r.answer === r.question.correctAnswer,
    ).length;
    const uniqueTotal = uniqueResults.length;
    const percentage = uniqueTotal > 0 ? Math.round((score / uniqueTotal) * 100) : 0;

    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-brand-gold">סיימתם את התרגול</p>
        <p className="mt-4 text-6xl font-bold text-brand-navy">{percentage}%</p>
        <p className="mt-3 text-lg text-brand-navy/70">
          {score} תשובות נכונות מתוך {uniqueTotal}
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

  if (!current) return null;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleToggleShuffle}
          aria-pressed={shuffleEnabled}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            shuffleEnabled
              ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
              : "border-brand-navy/15 bg-white text-brand-navy hover:border-brand-gold hover:text-brand-gold"
          }`}
        >
          <Shuffle size={14} />
          {shuffleEnabled ? "סדר אקראי" : "סדר רגיל"}
        </button>
      </div>

      {activeTagLabel && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-sm text-brand-navy">
          <span>
            מציג שאלות בנושא: <strong>{activeTagLabel}</strong>
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
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {gridOpen && (
          <div className="mt-3 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-brand-navy/60">
              <span>{answeredCount} מתוך {total} נענו</span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> סגור על זה
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> לא סגור
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> לא יודע
              </span>
            </div>
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
              {queue.map((q, i) => {
                const answer = answers[i] ?? null;
                const level = confidence[i] ?? null;
                const isCurrent = i === currentIndex;
                let cellClass =
                  "border-brand-navy/15 bg-brand-cream text-brand-navy/60 hover:border-brand-gold";
                if (level === "confident") {
                  cellClass = "border-emerald-400 bg-emerald-50 text-emerald-700";
                } else if (level === "unsure") {
                  cellClass = "border-amber-400 bg-amber-50 text-amber-700";
                } else if (level === "unknown") {
                  cellClass = "border-rose-400 bg-rose-50 text-rose-700";
                } else if (answer !== null) {
                  cellClass =
                    answer === q.correctAnswer
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-rose-400 bg-rose-50 text-rose-700";
                }
                return (
                  <button
                    key={`${q.id}-${i}`}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isCurrent}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${cellClass} ${
                      isCurrent ? "ring-2 ring-brand-gold ring-offset-1" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <QuestionCard
        key={`${current.id}-${currentIndex}`}
        question={current}
        selectedAnswer={selectedAnswer}
        confidence={currentConfidence}
        onSelect={handleSelect}
        onMarkConfidence={handleMarkConfidence}
        onOpenTag={(tag) => setModalTag(tag)}
      />

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 rounded-full border border-brand-navy/20 py-3 text-base font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          שאלה קודמת
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 rounded-full bg-brand-navy py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
        >
          {isLastQuestion ? "סיום וצפייה בתוצאות" : "השאלה הבאה"}
        </button>
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

const CONFIDENCE_BUTTONS: {
  level: ConfidenceLevel;
  label: string;
  icon: typeof ThumbsUp;
  activeClass: string;
  idleClass: string;
}[] = [
  {
    level: "confident",
    label: "בטוח בתשובה / סגור על זה",
    icon: ThumbsUp,
    activeClass: "border-emerald-400 bg-emerald-50 text-emerald-700",
    idleClass: "border-brand-navy/15 bg-white text-brand-navy/70 hover:border-emerald-400 hover:text-emerald-700",
  },
  {
    level: "unsure",
    label: "לא סגור / להתלבטות",
    icon: HelpCircle,
    activeClass: "border-amber-400 bg-amber-50 text-amber-700",
    idleClass: "border-brand-navy/15 bg-white text-brand-navy/70 hover:border-amber-400 hover:text-amber-700",
  },
  {
    level: "unknown",
    label: "לא מכיר את החומר / לא יודע",
    icon: AlertCircle,
    activeClass: "border-rose-400 bg-rose-50 text-rose-700",
    idleClass: "border-brand-navy/15 bg-white text-brand-navy/70 hover:border-rose-400 hover:text-rose-700",
  },
];

function QuestionCard({
  question,
  selectedAnswer,
  confidence,
  onSelect,
  onMarkConfidence,
  onOpenTag,
}: {
  question: Question;
  selectedAnswer: number | null;
  confidence: ConfidenceLevel | null;
  onSelect: (index: number) => void;
  onMarkConfidence: (level: ConfidenceLevel) => void;
  onOpenTag: (tag: string) => void;
}) {
  const [showDetailed, setShowDetailed] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="relative rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:p-8">
      <SourceBadge source={question.source} />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-brand-gold/40 bg-brand-navy px-3 py-1 text-xs font-bold text-brand-gold">
          #{question.id.replace(/^q/, "")}
        </span>
        <span className="rounded-full border border-brand-navy/15 bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">
          {question.category}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${DIFFICULTY_CLASS[question.difficulty]}`}
        >
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </div>

      <h2 className="mb-4 text-xl font-bold leading-8 text-brand-navy">
        {question.question}
      </h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onOpenTag(tag)}
            className="rounded-full border border-brand-navy/15 bg-brand-cream px-3 py-1 text-xs font-medium text-brand-navy/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            {formatTagLabel(tag)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => {
          const isCorrectOption = index === question.correctAnswer;
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
              onClick={() => onSelect(index)}
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
            <WikiText text={question.explanation} />
          </p>

          <div className="mt-4 border-t border-brand-navy/10 pt-4">
            <p className="mb-2 text-xs font-semibold text-brand-navy/60">
              עד כמה הרגשתם בטוחים בתשובה שלכם?
            </p>
            <div className="flex flex-wrap gap-2">
              {CONFIDENCE_BUTTONS.map(({ level, label, icon: Icon, activeClass, idleClass }) => {
                const isActive = confidence === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onMarkConfidence(level)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive ? activeClass : idleClass
                    }`}
                  >
                    <Icon size={14} className="shrink-0" />
                    {label}
                  </button>
                );
              })}
            </div>
            {confidence === "unknown" && (
              <p className="mt-2 text-xs text-brand-navy/50">
                השאלה הוזזה לסוף התור ותוצג לכם שוב בהמשך התרגול הנוכחי.
              </p>
            )}
          </div>

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
                <WikiText text={question.detailedExplanation} />
              </p>

              {question.conceptFaqs.length > 0 && (
                <div className="mt-4 border-t border-brand-navy/10 pt-4">
                  <p className="mb-2 text-sm font-bold text-brand-navy">
                    שאלות נפוצות וחיזוק המושג
                  </p>
                  <div className="flex flex-col gap-2">
                    {question.conceptFaqs.map((faq, i) => {
                      const open = openFaqIndex === i;
                      return (
                        <div
                          key={i}
                          className="rounded-lg border border-brand-navy/10"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenFaqIndex((prev) => (prev === i ? null : i))
                            }
                            aria-expanded={open}
                            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-start text-sm font-semibold text-brand-navy"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              size={16}
                              className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                            />
                          </button>
                          {open && (
                            <p className="px-3 pb-3 text-sm leading-7 text-brand-navy/80">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
        </div>
      )}

      {reportOpen && (
        <ReportIssueModal
          onClose={() => setReportOpen(false)}
          onSubmit={(message) => saveQuestionReport(question.id, message)}
          contextLabel={`שאלה ${question.id}`}
        />
      )}
    </div>
  );
}
