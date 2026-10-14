"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "samama-a11y-prefs";
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.5;
const STEP = 0.1;
const DEFAULT_PREFS: Prefs = {
  fontScale: 1,
  contrast: false,
  grayscale: false,
  highlightLinks: false,
};

type Prefs = {
  fontScale: number;
  contrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
};

function applyPrefs(prefs: Prefs) {
  const html = document.documentElement;
  html.style.setProperty("--a11y-font-scale", String(prefs.fontScale));
  html.setAttribute("data-a11y-contrast", String(prefs.contrast));
  html.setAttribute("data-a11y-grayscale", String(prefs.grayscale));
  html.setAttribute("data-a11y-highlight-links", String(prefs.highlightLinks));
}

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: Prefs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* localStorage unavailable (private mode, etc.) */
  }
}

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);

  useEffect(() => {
    applyPrefs(prefs);
    savePrefs(prefs);
  }, [prefs]);

  const update = (patch: Partial<Prefs>) =>
    setPrefs((prev) => ({ ...prev, ...patch }));

  const increaseFont = () =>
    update({ fontScale: Math.min(MAX_SCALE, +(prefs.fontScale + STEP).toFixed(2)) });

  const decreaseFont = () =>
    update({ fontScale: Math.max(MIN_SCALE, +(prefs.fontScale - STEP).toFixed(2)) });

  const reset = () => setPrefs(DEFAULT_PREFS);

  return (
    <div className="fixed bottom-5 start-5 z-50 flex flex-col items-start gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="תפריט נגישות"
          className="w-72 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-navy">תפריט נגישות</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגור תפריט נגישות"
              className="rounded-full p-1 text-brand-navy/60 hover:bg-brand-navy/5 hover:text-brand-navy"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-brand-navy/10 p-2">
              <span className="text-brand-navy">גודל טקסט</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={decreaseFont}
                  aria-label="הקטן טקסט"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy/5 font-bold text-brand-navy hover:bg-brand-navy/10"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={increaseFont}
                  aria-label="הגדל טקסט"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy/5 font-bold text-brand-navy hover:bg-brand-navy/10"
                >
                  A+
                </button>
              </div>
            </div>

            <ToggleRow
              label="ניגודיות גבוהה"
              checked={prefs.contrast}
              onChange={(v) => update({ contrast: v })}
            />
            <ToggleRow
              label="גווני אפור"
              checked={prefs.grayscale}
              onChange={(v) => update({ grayscale: v })}
            />
            <ToggleRow
              label="הדגשת קישורים"
              checked={prefs.highlightLinks}
              onChange={(v) => update({ highlightLinks: v })}
            />

            <button
              type="button"
              onClick={reset}
              className="mt-1 rounded-xl border border-brand-gold/40 bg-brand-gold/10 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/20"
            >
              איפוס הגדרות
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-gold-light shadow-xl transition-transform hover:scale-105"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="4" r="1.8" fill="currentColor" stroke="none" />
          <path
            d="M4.5 8.2c2.3.9 5 1.3 7.5 1.3s5.2-.4 7.5-1.3M12 9.5v4m0 0-2.8 7m2.8-7 2.8 7M9 13.2l-2.5 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M15 13.2l2.5 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-brand-navy/10 p-2">
      <span className="text-brand-navy">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-brand-gold" : "bg-brand-navy/15"
        }`}
      >
        <input
          type="checkbox"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </label>
  );
}
