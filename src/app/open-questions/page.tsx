import type { Metadata } from "next";
import OpenQuestionsPractice from "@/components/OpenQuestionsPractice";

export const metadata: Metadata = {
  title: "מאגר שאלות פתוחות וניתוח אירועים | Samama Mortgage",
};

export default function OpenQuestionsPage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <section className="border-b border-brand-navy/10 bg-gradient-to-b from-brand-navy to-brand-navy-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-brand-cream sm:text-3xl">
            מאגר שאלות פתוחות וניתוח אירועים
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-brand-cream/70 sm:text-base">
            תרחישים מורכבים ושאלות חישוב, בדיוק כמו במבחן האמיתי. נסו לפתור
            בעצמכם לפני שאתם חושפים את הפתרון המלא, שלב-אחר-שלב, עם ציטוט
            הסעיף הרגולטורי הרלוונטי.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <OpenQuestionsPractice />
      </section>
    </div>
  );
}
