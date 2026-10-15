import type { Metadata } from "next";
import ExamSimulation from "@/components/ExamSimulation";

export const metadata: Metadata = {
  title: "סימולציית מבחן מלאה | Samama Mortgage",
};

export default function ExamPage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <section className="border-b border-brand-navy/10 bg-gradient-to-b from-brand-navy to-brand-navy-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-brand-cream sm:text-3xl">
            סימולציית מבחן מלאה
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-brand-cream/70 sm:text-base">
            חוויית מבחן בתנאי אמת: 25 שאלות אקראיות, 90 דקות, ללא חשיפת
            תשובות עד הסוף.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <ExamSimulation />
      </section>
    </div>
  );
}
