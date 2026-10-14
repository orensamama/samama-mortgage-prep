import Image from "next/image";
import PracticeSuite from "@/components/PracticeSuite";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <section className="border-b border-brand-navy/10 bg-gradient-to-b from-brand-navy to-brand-navy-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center">
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-xl">
            <Image
              src="/logo.png"
              alt="Samama Mortgage"
              width={662}
              height={377}
              priority
              className="h-16 w-auto object-contain sm:h-20"
            />
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-brand-cream sm:text-4xl">
            Samama Mortgage - הכנה למבחן ההתאחדות
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-brand-cream/70">
            תרגלו שאלות אמריקאיות בנושאי רגולציית בנק ישראל, תמהיל תשלומים ומיסוי
            מקרקעין, וקבלו הסבר מפורט לכל שאלה.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <PracticeSuite />
      </section>
    </div>
  );
}
