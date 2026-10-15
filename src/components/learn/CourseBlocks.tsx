import type { ReactNode } from "react";
import { ArrowDown, BookOpenCheck, Lightbulb, Scale } from "lucide-react";

export function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-brand-cream">
      {n}
    </span>
  );
}

export function LegalBox({
  title = "המקור המשפטי",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 rounded-xl border border-brand-navy/15 bg-brand-navy/5 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Scale size={16} className="shrink-0 text-brand-navy/70" />
        <p className="text-sm font-bold text-brand-navy">{title}</p>
      </div>
      <div className="text-sm leading-7 text-brand-navy/80">{children}</div>
    </div>
  );
}

export function AnalogyBox({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb size={16} className="shrink-0 text-brand-gold" />
        <p className="text-sm font-bold text-brand-navy">בשפה פשוטה</p>
      </div>
      <div className="text-sm leading-7 text-brand-navy/80">{children}</div>
    </div>
  );
}

export function WorkedExample({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-brand-navy/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-brand-navy/10 bg-brand-navy px-5 py-3">
        <BookOpenCheck size={16} className="shrink-0 text-brand-cream" />
        <p className="text-sm font-bold text-brand-cream">{title}</p>
      </div>
      <div className="flex flex-col gap-4 p-5">{children}</div>
    </div>
  );
}

export function ExampleStep({
  n,
  label,
  children,
}: {
  n: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <StepBadge n={n} />
      <div className="flex-1">
        <p className="text-sm font-bold text-brand-navy">{label}</p>
        <div className="mt-1 text-sm leading-7 text-brand-navy/80">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 mt-10 first:mt-0">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-gold">
        {eyebrow}
      </p>
      <h2 className="text-xl font-bold text-brand-navy sm:text-2xl">
        {children}
      </h2>
    </div>
  );
}

export function RegTable({
  headers,
  rows,
  highlightCol,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  highlightCol?: number;
}) {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl border border-brand-navy/10 shadow-sm">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-brand-navy text-brand-cream">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-start font-bold first:rounded-tr-xl last:rounded-tl-xl"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 0 ? "bg-white" : "bg-brand-cream/60"}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border-t border-brand-navy/10 px-4 py-3 text-brand-navy ${
                    ci === highlightCol ? "font-bold text-brand-gold" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FlowChart({ steps }: { steps: ReactNode[] }) {
  return (
    <div className="mb-6 flex flex-col items-stretch gap-0 rounded-xl border border-brand-navy/10 bg-white p-5 shadow-sm">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-full rounded-lg border border-brand-navy/15 bg-brand-cream/60 px-4 py-3 text-center text-sm font-medium leading-6 text-brand-navy">
            {step}
          </div>
          {i < steps.length - 1 && (
            <ArrowDown size={18} className="my-1 shrink-0 text-brand-gold" />
          )}
        </div>
      ))}
    </div>
  );
}

export function BranchFlow({
  question,
  branches,
}: {
  question: ReactNode;
  branches: { label: string; result: ReactNode; positive?: boolean }[];
}) {
  return (
    <div className="mb-6 rounded-xl border border-brand-navy/10 bg-white p-5 shadow-sm">
      <div className="mx-auto mb-3 w-full max-w-md rounded-lg border border-brand-navy/20 bg-brand-navy px-4 py-3 text-center text-sm font-bold text-brand-cream">
        {question}
      </div>
      <div
        className={`grid gap-3 ${branches.length === 2 ? "sm:grid-cols-2" : ""}`}
      >
        {branches.map((b, i) => (
          <div key={i} className="flex flex-col items-center">
            <ArrowDown size={16} className="mb-1 shrink-0 text-brand-gold" />
            <div className="mb-1 text-xs font-bold text-brand-navy/60">
              {b.label}
            </div>
            <div
              className={`w-full rounded-lg border px-4 py-3 text-center text-sm font-medium leading-6 ${
                b.positive
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-rose-300 bg-rose-50 text-rose-800"
              }`}
            >
              {b.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NoteCallout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
      {children}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 text-sm leading-7 text-brand-navy/80">
      {children}
    </div>
  );
}
