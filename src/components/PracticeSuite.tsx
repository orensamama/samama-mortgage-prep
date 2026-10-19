"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  Flag,
  HelpCircle,
  LayoutGrid,
  Lightbulb,
  RotateCcw,
  Shuffle,
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

type QuestionStatus = "correct" | "wrong" | "unsure";
type StatusBucket = QuestionStatus | "none";

const STATUS_CYCLE: (QuestionStatus | null)[] = ["correct", "wrong", "unsure", null];

const FILTER_OPTIONS: { key: StatusBucket; label: string }[] = [
  { key: "correct", label: "שאלות שנלמדו / נכונות (✓)" },
  { key: "wrong", label: "שאלות עם טעויות (✗)" },
  { key: "unsure", label: "שאלות בסימן שאלה (?)" },
  { key: "none", label: "שאלות שטרם נענו" },
];

const STATUS_TILES: {
  key: StatusBucket;
  label: string;
  dotClass: string;
  textClass: string;
}[] = [
  { key: "correct", label: "נכונות", dotClass: "bg-emerald-400", textClass: "text-emerald-700" },
  { key: "wrong", label: "טעויות", dotClass: "bg-rose-400", textClass: "text-rose-700" },
  { key: "unsure", label: "סימן שאלה", dotClass: "bg-amber-400", textClass: "text-amber-700" },
  { key: "none", label: "טרם נענו", dotClass: "bg-brand-navy/30", textClass: "text-brand-navy/60" },
];

const LONG_PRESS_MS = 500;

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
  const [status, setStatus] = useState<(QuestionStatus | null)[]>(
    Array(orderedPool.length).fill(null),
  );
  const [finished, setFinished] = useState(false);
  const [modalTag, setModalTag] = useState<string | null>(null);
  const [gridOpen, setGridOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<Record<StatusBucket, boolean>>({
    correct: true,
    wrong: true,
    unsure: true,
    none: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const total = queue.length;
  const current: Question | undefined = queue[currentIndex];
  const isLastQuestion = currentIndex === total - 1;
  const activeTagLabel = activeTag ? formatTagLabel(activeTag) : null;
  const selectedAnswer = answers[currentIndex] ?? null;
  const currentStatus = status[currentIndex] ?? null;

  const resetProgress = (nextPool: Question[], options?: { keepGridOpen?: boolean }) => {
    setQueue(nextPool);
    setCurrentIndex(0);
    setAnswers(Array(nextPool.length).fill(null));
    setStatus(Array(nextPool.length).fill(null));
    setFinished(false);
    if (!options?.keepGridOpen) setGridOpen(false);
  };

  const handleSelect = (optionIndex: number) => {
    if (selectedAnswer !== null || !current) return;
    setAnswers((prev) => {
      const next = prev.length === total ? [...prev] : Array(total).fill(null);
      next[currentIndex] = optionIndex;
      return next;
    });
    setStatus((prev) => {
      const next = prev.length === total ? [...prev] : Array(total).fill(null);
      next[currentIndex] = optionIndex === current.correctAnswer ? "correct" : "wrong";
      return next;
    });
  };

  // Manual override from the question card - sets (or, clicked again, clears)
  // this question's status directly, independent of whether it was answered.
  const handleToggleStatus = (level: QuestionStatus) => {
    setStatus((prev) => {
      const next = prev.length === total ? [...prev] : Array(total).fill(null);
      next[currentIndex] = next[currentIndex] === level ? null : level;
      return next;
    });
  };

  // Question-map cell click - cycles ✓ -> ✗ -> ? -> neutral, regardless of
  // whether the underlying question was actually answered.
  const handleCycleStatus = (index: number) => {
    setStatus((prev) => {
      const next = prev.length === total ? [...prev] : Array(total).fill(null);
      const pos = STATUS_CYCLE.indexOf(next[index] ?? null);
      next[index] = STATUS_CYCLE[(pos + 1) % STATUS_CYCLE.length];
      return next;
    });
  };

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)));
    setGridOpen(false);
  };

  // Lets the question card jump straight back to the map view, scrolling it
  // into sight in case the reader has scrolled down past it.
  const handleOpenMap = () => {
    setGridOpen(true);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const handleResetBoard = () => {
    resetProgress(orderedPool, { keepGridOpen: true });
  };

  const toggleStatusFilter = (key: StatusBucket) => {
    setStatusFilter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllFilters = () => {
    setStatusFilter({ correct: true, wrong: true, unsure: true, none: true });
  };

  const handleClearAllFilters = () => {
    setStatusFilter({ correct: false, wrong: false, unsure: false, none: false });
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

  // Overall status tally across the current queue - drives both the stats
  // dashboard tiles and the "none"/unanswered filter bucket.
  const statusCounts = useMemo(() => {
    const counts: Record<StatusBucket, number> = { correct: 0, wrong: 0, unsure: 0, none: 0 };
    for (let i = 0; i < queue.length; i++) {
      const bucket: StatusBucket = status[i] ?? "none";
      counts[bucket] += 1;
    }
    return counts;
  }, [queue, status]);

  // Per-category success rate, counted only among questions graded ✓/✗
  // (an "unsure" or unanswered mark doesn't yet count toward a verdict).
  const categoryStats = useMemo(() => {
    const map = new Map<string, { correct: number; wrong: number }>();
    queue.forEach((q, i) => {
      const bucket = status[i];
      if (bucket !== "correct" && bucket !== "wrong") return;
      const entry = map.get(q.category) ?? { correct: 0, wrong: 0 };
      if (bucket === "correct") entry.correct += 1;
      else entry.wrong += 1;
      map.set(q.category, entry);
    });
    return [...map.entries()]
      .map(([name, { correct, wrong }]) => ({
        name,
        total: correct + wrong,
        pct: Math.round((correct / (correct + wrong)) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, [queue, status]);

  // Free-text search over a question's id, category, tags, and body - lets the
  // user jump straight to a concept/keyword/#ID instead of scanning the grid.
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const matchesSearch = (q: Question) => {
    if (!normalizedSearch) return true;
    const shortId = q.id.replace(/^o?q/, "");
    const haystack = [
      q.id,
      `#${shortId}`,
      shortId,
      q.category,
      q.question,
      ...(q.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedSearch);
  };

  const visibleQueueCount = queue.filter(
    (q, i) => statusFilter[status[i] ?? "none"] && matchesSearch(q),
  ).length;

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

      <div ref={mapSectionRef} className="mb-6 scroll-mt-4">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-navy/70">
          <span>
            שאלה {currentIndex + 1} מתוך {total}{" "}
            <span className="text-brand-navy/40">
              (#{current.id.replace(/^q/, "")})
            </span>
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
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatsModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy hover:border-brand-gold hover:text-brand-gold"
              >
                📊 סטטיסטיקה
              </button>
              <button
                type="button"
                onClick={() => setFilterMenuOpen((prev) => !prev)}
                aria-expanded={filterMenuOpen}
                className="flex items-center gap-1.5 rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy hover:border-brand-gold hover:text-brand-gold"
              >
                🔍 סינון שאלות
                <ChevronDown
                  size={14}
                  className={`transition-transform ${filterMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {filterMenuOpen && (
              <div className="rounded-xl border border-brand-navy/10 bg-brand-cream/40 p-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש מושג, מילת מפתח או #ID..."
                  className="mb-3 w-full rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:outline-none"
                />
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-brand-navy">סינון מפת השאלות</p>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={handleSelectAllFilters}
                      className="rounded-full border border-brand-navy/15 bg-white px-2.5 py-1 text-brand-navy/70 hover:border-brand-gold hover:text-brand-gold"
                    >
                      בחר הכל
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllFilters}
                      className="rounded-full border border-brand-navy/15 bg-white px-2.5 py-1 text-brand-navy/70 hover:border-brand-gold hover:text-brand-gold"
                    >
                      בטל הכל
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {FILTER_OPTIONS.map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-brand-navy/70"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilter[key]}
                        onChange={() => toggleStatusFilter(key)}
                        className="h-3.5 w-3.5 rounded border-brand-navy/30"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {visibleQueueCount === 0 ? (
              <p className="rounded-xl border border-dashed border-brand-navy/15 p-4 text-center text-sm text-brand-navy/50">
                {normalizedSearch
                  ? `לא נמצאו שאלות התואמות את החיפוש "${searchQuery.trim()}".`
                  : "לא נבחרו קטגוריות סינון - סמנו לפחות ריבוע אחד כדי להציג שאלות."}
              </p>
            ) : (
              <div className="grid grid-cols-6 gap-2.5 sm:grid-cols-8">
                {queue.map((q, i) => {
                  const bucket: StatusBucket = status[i] ?? "none";
                  if (!statusFilter[bucket] || !matchesSearch(q)) return null;
                  return (
                    <QuestionMapCell
                      key={`${q.id}-${i}`}
                      index={i}
                      total={total}
                      questionId={q.id}
                      bucket={bucket}
                      isCurrent={i === currentIndex}
                      onShortPress={() => goTo(i)}
                      onLongPress={() => handleCycleStatus(i)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {statsModalOpen && (
        <StatsModal
          statusCounts={statusCounts}
          total={total}
          categoryStats={categoryStats}
          onReset={() => {
            handleResetBoard();
            setStatsModalOpen(false);
          }}
          onClose={() => setStatsModalOpen(false)}
        />
      )}

      <QuestionCard
        key={`${current.id}-${currentIndex}`}
        question={current}
        selectedAnswer={selectedAnswer}
        status={currentStatus}
        onSelect={handleSelect}
        onToggleStatus={handleToggleStatus}
        onOpenTag={(tag) => setModalTag(tag)}
        onOpenMap={handleOpenMap}
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

const STATUS_BUTTONS: {
  level: QuestionStatus;
  label: string;
  icon: typeof CheckCircle2;
  activeClass: string;
  idleClass: string;
}[] = [
  {
    level: "correct",
    label: "סמן כנכון / נלמד",
    icon: CheckCircle2,
    activeClass: "border-emerald-400 bg-emerald-50 text-emerald-700",
    idleClass: "border-brand-navy/15 bg-white text-brand-navy/40 hover:border-emerald-400 hover:text-emerald-600",
  },
  {
    level: "wrong",
    label: "סמן כטעות",
    icon: XCircle,
    activeClass: "border-rose-400 bg-rose-50 text-rose-700",
    idleClass: "border-brand-navy/15 bg-white text-brand-navy/40 hover:border-rose-400 hover:text-rose-600",
  },
  {
    level: "unsure",
    label: "סמן בסימן שאלה / לא בטוח",
    icon: HelpCircle,
    activeClass: "border-amber-400 bg-amber-50 text-amber-700",
    idleClass: "border-brand-navy/15 bg-white text-brand-navy/40 hover:border-amber-400 hover:text-amber-600",
  },
];

function QuestionCard({
  question,
  selectedAnswer,
  status,
  onSelect,
  onToggleStatus,
  onOpenTag,
  onOpenMap,
}: {
  question: Question;
  selectedAnswer: number | null;
  status: QuestionStatus | null;
  onSelect: (index: number) => void;
  onToggleStatus: (level: QuestionStatus) => void;
  onOpenTag: (tag: string) => void;
  onOpenMap: () => void;
}) {
  const [showDetailed, setShowDetailed] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="relative rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:p-8">
      <SourceBadge source={question.source} />
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenMap}
          className="flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-gold/20"
        >
          🗺️ מפת שאלות
        </button>
        <span className="flex items-center gap-1.5">
          {STATUS_BUTTONS.map(({ level, label, icon: Icon, activeClass, idleClass }) => {
            const isActive = status === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onToggleStatus(level)}
                aria-pressed={isActive}
                title={label}
                aria-label={label}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                  isActive ? activeClass : idleClass
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </span>
      </div>
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

const CELL_CLASS: Record<StatusBucket, string> = {
  correct: "border-emerald-400 bg-emerald-50 text-emerald-700",
  wrong: "border-rose-400 bg-rose-50 text-rose-700",
  unsure: "border-amber-400 bg-amber-50 text-amber-700",
  none: "border-brand-navy/15 bg-brand-cream text-brand-navy/60 hover:border-brand-gold",
};

// A grid cell with two distinct gestures on the same element: a short tap
// opens the question immediately, while holding for LONG_PRESS_MS cycles the
// status badge without navigating. The long-press timer lives per-cell (a
// ref), and a "suppress" flag swallows the click event that still follows a
// completed long-press release, so a single release never fires both.
function QuestionMapCell({
  index,
  total,
  questionId,
  bucket,
  isCurrent,
  onShortPress,
  onLongPress,
}: {
  index: number;
  total: number;
  questionId: string;
  bucket: StatusBucket;
  isCurrent: boolean;
  onShortPress: () => void;
  onLongPress: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      suppressClickRef.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = () => {
    clearTimer();
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onShortPress();
  };

  const shortId = questionId.replace(/^q/, "");

  return (
    <div className="relative">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={clearTimer}
        onPointerCancel={clearTimer}
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleClick}
        aria-current={isCurrent}
        title={`שאלה ${index + 1} מתוך ${total} (#${shortId}) - לחיצה קצרה פותחת, לחיצה ארוכה מחליפה סטטוס`}
        className={`flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-lg border text-xs font-bold leading-none transition-colors ${CELL_CLASS[bucket]} ${
          isCurrent ? "ring-2 ring-brand-gold ring-offset-1" : ""
        }`}
      >
        <span>{index + 1}</span>
        <span className="text-[9px] font-normal opacity-60">#{shortId}</span>
      </button>
      {bucket !== "none" && (
        <span
          className={`pointer-events-none absolute -top-1.5 -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white text-white ${
            bucket === "correct" ? "bg-emerald-500" : bucket === "wrong" ? "bg-rose-500" : "bg-amber-500"
          }`}
        >
          {bucket === "correct" && <CheckCircle2 size={11} strokeWidth={3} />}
          {bucket === "wrong" && <XCircle size={11} strokeWidth={3} />}
          {bucket === "unsure" && <HelpCircle size={11} strokeWidth={3} />}
        </span>
      )}
    </div>
  );
}

function StatsModal({
  statusCounts,
  total,
  categoryStats,
  onReset,
  onClose,
}: {
  statusCounts: Record<StatusBucket, number>;
  total: number;
  categoryStats: { name: string; total: number; pct: number }[];
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="סטטיסטיקת תרגול"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-brand-navy">📊 סטטיסטיקת תרגול</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="rounded-full p-1 text-brand-navy/60 hover:bg-brand-navy/5 hover:text-brand-navy"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STATUS_TILES.map(({ key, label, dotClass, textClass }) => {
            const count = statusCounts[key];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key} className="rounded-xl border border-brand-navy/10 bg-brand-cream/50 p-2.5 text-center">
                <span className={`mx-auto mb-1 flex h-2 w-2 rounded-full ${dotClass}`} />
                <p className={`text-lg font-bold leading-none ${textClass}`}>{count}</p>
                <p className="mt-1 text-[11px] text-brand-navy/60">
                  {label} ({pct}%)
                </p>
              </div>
            );
          })}
        </div>

        {categoryStats.length > 0 && (
          <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-brand-navy/10 p-2.5">
            <p className="mb-1.5 text-xs font-semibold text-brand-navy/60">
              הצלחה לפי קטגוריה (מתוך שאלות שסומנו ✓/✗)
            </p>
            <div className="flex flex-col gap-1.5">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 truncate text-brand-navy/70" title={cat.name}>
                    {cat.name}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-navy/10">
                    <div className="h-full rounded-full bg-brand-gold" style={{ width: `${cat.pct}%` }} />
                  </div>
                  <span className="w-9 shrink-0 text-end font-semibold text-brand-navy/70">
                    {cat.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 py-3 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-400 hover:bg-rose-100"
        >
          <RotateCcw size={15} />
          אפס סטטיסטיקה / התחל סבב חדש
        </button>
      </div>
    </div>
  );
}
