"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";

export default function ReportIssueModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit(message.trim());
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="דיווח על טעות בשאלה"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        {submitted ? (
          <div className="py-4 text-center">
            <p className="text-lg font-bold text-brand-navy">
              תודה! הדיווח התקבל וייבדק בהקדם
            </p>
            <p className="mt-2 text-sm leading-7 text-brand-navy/70">
              אנו מעריכים את העזרה בשיפור דיוק התכנים.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-brand-navy py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light"
            >
              סגור
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Flag size={18} className="shrink-0 text-brand-gold" />
                <h3 className="text-lg font-bold text-brand-navy">
                  דיווח על טעות או עדכון רגולטורי
                </h3>
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

            <p className="mb-3 text-sm leading-7 text-brand-navy/70">
              מצאתם אי-דיוק בשאלה, בתשובה או עדכון רגולטורי שכדאי שנדע עליו?
              ספרו לנו בקצרה.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="לדוגמה: התשובה הנכונה השתנתה לאחר עדכון הוראת ניהול בנקאי תקין..."
              rows={4}
              className="w-full resize-none rounded-xl border border-brand-navy/15 bg-brand-cream/40 p-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="mt-4 w-full rounded-full bg-brand-navy py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              שלח דיווח
            </button>
          </>
        )}
      </div>
    </div>
  );
}
