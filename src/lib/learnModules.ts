export type LearnModule = {
  slug: string;
  order: number;
  title: string;
  shortTitle: string;
  summary: string;
  icon:
    | "scale"
    | "percent"
    | "banknote"
    | "trending-up"
    | "ruler"
    | "receipt";
};

export const LEARN_MODULES: LearnModule[] = [
  {
    slug: "regulation",
    order: 1,
    title: "רגולציה ומגבלות בנק ישראל - הוראה 329",
    shortTitle: "רגולציה והוראה 329",
    summary:
      "מגבלות המימון (LTV) לפי סוג דירה, תקרת תקופת ההלוואה, מגבלת הריבית המשתנה, ודירות במחיר מופחת - הכל ישירות מנוסח ההוראה העדכני (גרסה 11, אפריל 2025).",
    icon: "scale",
  },
  {
    slug: "pti-ltv",
    order: 2,
    title: "יחס החזר מהכנסה (PTI) ושיעור מימון (LTV)",
    shortTitle: "PTI ו-LTV",
    summary:
      "איך בנק בודק אם לקוח 'יכול להרשות לעצמו' את ההלוואה, מה בדיוק נכנס לחישוב ההכנסה הפנויה, ואיך שיעור המימון נמדד בפועל - עם חישובים מלאים שלב אחר שלב.",
    icon: "percent",
  },
  {
    slug: "capital-allocation",
    order: 3,
    title: "הקצאות הון - איך הבנק מתמחר סיכון",
    shortTitle: "הקצאת הון",
    summary:
      "המדרגות המדויקות (35% / 50% / 75%) לפי הוראה 203, ולמה יחס החזר מעל 40% מפעיל 'דגל אדום' נפרד של 100% - כולל תיקון לבלבול נפוץ בחומרי הכנה.",
    icon: "banknote",
  },
  {
    slug: "interest-tracks",
    order: 4,
    title: "מסלולי ריבית ותמהיל משכנתא",
    shortTitle: "מסלולי ריבית",
    summary:
      "קבוע מול משתנה, צמוד מדד מול לא צמוד, פריים, ומגבלת שני-השליש על המסלולים המשתנים - עם דוגמה מלאה לבניית תמהיל.",
    icon: "trending-up",
  },
  {
    slug: "appraisal",
    order: 5,
    title: "שמאות מקרקעין למשכנתא",
    shortTitle: "שמאות",
    summary:
      "ההבדל בין שווי שוק, שווי למימוש מהיר וערך כינון, ואיך שמאות קובעת בפועל את תקרת המשכנתא כשהיא נמוכה ממחיר החוזה.",
    icon: "ruler",
  },
  {
    slug: "prepayment",
    order: 6,
    title: "עמלות פירעון מוקדם ומחזור משכנתא",
    shortTitle: "פירעון מוקדם",
    summary:
      "חישוב מדויק של עמלת היוון שלב-אחר-שלב, מתי היא לא חלה כלל, ומה ההבדל בינה לבין עמלת התפעול ועמלת אי-ההודעה המוקדמת.",
    icon: "receipt",
  },
];

export function getLearnModule(slug: string): LearnModule | undefined {
  return LEARN_MODULES.find((m) => m.slug === slug);
}

export function getAdjacentModules(slug: string): {
  prev: LearnModule | null;
  next: LearnModule | null;
} {
  const sorted = [...LEARN_MODULES].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((m) => m.slug === slug);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
