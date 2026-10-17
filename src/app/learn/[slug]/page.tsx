import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  LEARN_MODULES,
  getAdjacentModules,
  getLearnModule,
} from "@/lib/learnModules";

import RegulationModule from "@/components/learn/modules/RegulationModule";
import PtiLtvModule from "@/components/learn/modules/PtiLtvModule";
import CapitalAllocationModule from "@/components/learn/modules/CapitalAllocationModule";
import InterestTracksModule from "@/components/learn/modules/InterestTracksModule";
import AmortizationModule from "@/components/learn/modules/AmortizationModule";
import AppraisalModule from "@/components/learn/modules/AppraisalModule";
import CollateralLegalModule from "@/components/learn/modules/CollateralLegalModule";
import PrepaymentModule from "@/components/learn/modules/PrepaymentModule";
import RefinancingModule from "@/components/learn/modules/RefinancingModule";
import TaxationModule from "@/components/learn/modules/TaxationModule";

const MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  regulation: RegulationModule,
  "pti-ltv": PtiLtvModule,
  "capital-allocation": CapitalAllocationModule,
  "interest-tracks": InterestTracksModule,
  amortization: AmortizationModule,
  appraisal: AppraisalModule,
  "collateral-legal": CollateralLegalModule,
  prepayment: PrepaymentModule,
  refinancing: RefinancingModule,
  taxation: TaxationModule,
};

export function generateStaticParams() {
  return LEARN_MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = getLearnModule(slug);
  return {
    title: mod ? `${mod.title} | Samama Mortgage` : "קורס מקצועי",
  };
}

export default async function LearnModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getLearnModule(slug);
  const Component = MODULE_COMPONENTS[slug];

  if (!mod || !Component) {
    notFound();
  }

  const { prev, next } = getAdjacentModules(slug);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14">
      <Link
        href="/learn"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy/60 hover:text-brand-gold"
      >
        <ChevronRight size={16} />
        חזרה למרכז הידע
      </Link>

      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-gold">
        פרק {mod.order} מתוך {LEARN_MODULES.length}
      </p>
      <h1 className="mb-8 text-2xl font-bold text-brand-navy sm:text-3xl">
        {mod.title}
      </h1>

      <Component />

      <div className="mt-12 flex items-center justify-between gap-4 border-t border-brand-navy/10 pt-6">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="flex flex-1 items-center gap-2 rounded-xl border border-brand-navy/10 bg-white p-4 text-end shadow-sm transition-colors hover:border-brand-gold"
          >
            <ChevronRight size={18} className="shrink-0 text-brand-gold" />
            <span>
              <span className="block text-xs text-brand-navy/50">
                פרק קודם
              </span>
              <span className="block text-sm font-semibold text-brand-navy">
                {prev.shortTitle}
              </span>
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="flex flex-1 items-center justify-end gap-2 rounded-xl border border-brand-navy/10 bg-white p-4 text-end shadow-sm transition-colors hover:border-brand-gold"
          >
            <span>
              <span className="block text-xs text-brand-navy/50">
                פרק הבא
              </span>
              <span className="block text-sm font-semibold text-brand-navy">
                {next.shortTitle}
              </span>
            </span>
            <ChevronLeft size={18} className="shrink-0 text-brand-gold" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
