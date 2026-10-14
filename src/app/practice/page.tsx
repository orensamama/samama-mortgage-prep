import { Suspense } from "react";
import type { Metadata } from "next";
import PracticeSuite from "@/components/PracticeSuite";

export const metadata: Metadata = {
  title: "תרגול שאלות | Samama Mortgage",
};

export default function PracticePage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <section className="border-b border-brand-navy/10 bg-gradient-to-b from-brand-navy to-brand-navy-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-brand-cream sm:text-3xl">
            תרגול שאלות
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-brand-cream/70 sm:text-base">
            ענו על השאלות, קבלו משוב מיידי על כל תשובה, והרחיבו את הידע שלכם
            בלחיצה אחת.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <Suspense fallback={null}>
          <PracticeSuite />
        </Suspense>
      </section>
    </div>
  );
}
