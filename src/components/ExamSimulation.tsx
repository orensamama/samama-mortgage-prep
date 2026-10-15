"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, LayoutGrid, RotateCcw } from "lucide-react";
import { questions as allQuestions, type Question } from "@/lib/questions";

const EXAM_QUESTION_COUNT = 25;
const EXAM_DURATION_SECONDS = 90 * 60;

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Phase = "intro" | "running" | "finished";

export default function ExamSimulation() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [gridOpen, setGridOpen] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!finishedRef.current) {
            finishedRef.current = true;
            setPhase("finished");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleStart = () => {
    const count = Math.min(EXAM_QUESTION_COUNT, allQuestions.length);
    const sampled = shuffleArray(allQuestions).slice(0, count);
    setExamQuestions(sampled);
    setAnswers(Array(sampled.length).fill(null));
    setCurrentIndex(0);
    setSecondsLeft(EXAM_DURATION_SECONDS);
    finishedRef.current = false;
    setPhase("running");
  };

  const handleFinish = () => {
    finishedRef.current = true;
    setPhase("finished");
  };

  const handleRestart = () => {
    setPhase("intro");
    setExamQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setGridOpen(false);
    finishedRef.current = false;
  };

  const total = examQuestions.length;
  const current = examQuestions[currentIndex];
  const selectedAnswer = answers[currentIndex] ?? null;
  const answeredCount = answers.filter((a) => a !== null).length;

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)));
    setGridOpen(false);
  };

  if (phase === "intro") {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-brand-navy/10 bg-white p-8 text-center shadow-sm sm:p-10">
        <Clock className="mx-auto mb-4 text-brand-gold" size={40} />
        <h2 className="mb-3 text-xl font-bold text-brand-navy">
          סימולציית מבחן מלאה
        </h2>
        <ul className="mx-auto mb-8 max-w-sm space-y-2 text-start text-sm leading-7 text-brand-navy/70">
          <li>• 25 שאלות אקראיות מתוך מאגר השאלות המלא.</li>
          <li>• מגבלת זמן של 90 דקות, בדיוק כמו במבחן האמיתי.</li>
          <li>• ללא חשיפת תשובה נכונה או הסבר במהלך המבחן.</li>
          <li>• בסיום תקבלו ציון וניתוח מפורט של הטעויות.</li>
        </ul>
        <button
          type="button"
          onClick={handleStart}
          className="rounded-full bg-brand-navy px-8 py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
        >
          התחל סימולציה
        </button>
      </div>
    );
  }

  if (phase === "finished") {
    const score = answers.filter(
      (answer, i) =>
        answer !== null && answer === examQuestions[i]?.correctAnswer,
    ).length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const mistakes = examQuestions
      .map((q, i) => ({ q, i, answer: answers[i] ?? null }))
      .filter(({ q, answer }) => answer !== q.correctAnswer);

    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-sm font-semibold text-brand-gold">
            הסימולציה הסתיימה
          </p>
          <p className="mt-4 text-6xl font-bold text-brand-navy">
            {percentage}%
          </p>
          <p className="mt-3 text-lg text-brand-navy/70">
            {score} תשובות נכונות מתוך {total}
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            <RotateCcw size={18} />
            סימולציה חדשה
          </button>
        </div>

        {mistakes.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold text-brand-navy">
              ניתוח טעויות ({mistakes.length})
            </h3>
            <div className="flex flex-col gap-4">
              {mistakes.map(({ q, i, answer }) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5"
                >
                  <p className="mb-3 text-sm font-bold text-brand-navy">
                    שאלה {i + 1}: {q.question}
                  </p>
                  <p className="mb-1 text-sm text-rose-700">
                    {answer !== null
                      ? `התשובה שלכם: ${q.options[answer]}`
                      : "לא ניתנה תשובה"}
                  </p>
                  <p className="mb-3 text-sm font-semibold text-emerald-700">
                    התשובה הנכונה: {q.options[q.correctAnswer]}
                  </p>
                  <p className="text-sm leading-7 text-brand-navy/70">
                    {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-4 flex items-center justify-between gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-navy">
        <span className="flex items-center gap-1.5">
          <Clock size={16} />
          זמן שנותר: {formatTime(secondsLeft)}
        </span>
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-full border border-brand-navy/20 bg-white px-3 py-1 text-xs font-semibold text-brand-navy hover:border-rose-400 hover:text-rose-600"
        >
          סיים מבחן
        </button>
      </div>

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
            <p className="mb-2 text-xs text-brand-navy/60">
              {answeredCount} מתוך {total} נענו
            </p>
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
              {examQuestions.map((q, i) => {
                const answered = answers[i] !== null;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${
                      answered
                        ? "border-brand-gold bg-brand-gold/10 text-brand-navy"
                        : "border-brand-navy/15 bg-brand-cream text-brand-navy/60"
                    } ${isCurrent ? "ring-2 ring-brand-gold ring-offset-1" : ""}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-xl font-bold leading-8 text-brand-navy">
          {current.question}
        </h2>
        <div className="flex flex-col gap-3">
          {current.options.map((option, index) => {
            const isSelected = index === selectedAnswer;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-base font-medium text-brand-navy transition-colors ${
                  isSelected
                    ? "border-brand-gold bg-brand-gold/10"
                    : "border-brand-navy/15 bg-white hover:border-brand-gold hover:bg-brand-gold/5"
                }`}
              >
                <span>{option}</span>
                {isSelected && (
                  <CheckCircle2 size={20} className="shrink-0 text-brand-gold" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="flex-1 rounded-full border border-brand-navy/20 py-3 text-base font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          שאלה קודמת
        </button>
        {currentIndex === total - 1 ? (
          <button
            type="button"
            onClick={handleFinish}
            className="flex-1 rounded-full bg-brand-navy py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            סיום וצפייה בתוצאות
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            className="flex-1 rounded-full bg-brand-navy py-3 text-base font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            השאלה הבאה
          </button>
        )}
      </div>
    </div>
  );
}
