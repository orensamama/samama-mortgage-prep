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
    | "receipt"
    | "layers"
    | "file-text"
    | "coins"
    | "repeat";
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
    slug: "amortization",
    order: 5,
    title: "לוחות סילוקין - שפיצר, קרן שווה, גרייס ובלון",
    shortTitle: "לוחות סילוקין",
    summary:
      "ההבדל בין החזר קבוע (שפיצר) להחזר על קרן קבועה, מה קורה בתקופת גרייס חלקי מול גרייס מלא, וריבית דריבית - עם השוואה מספרית מלאה לאותה הלוואה.",
    icon: "layers",
  },
  {
    slug: "appraisal",
    order: 6,
    title: "שמאות מקרקעין למשכנתא",
    shortTitle: "שמאות",
    summary:
      "ההבדל בין שווי שוק, שווי למימוש מהיר וערך כינון, ואיך שמאות קובעת בפועל את תקרת המשכנתא כשהיא נמוכה ממחיר החוזה.",
    icon: "ruler",
  },
  {
    slug: "collateral-legal",
    order: 7,
    title: "ביטחונות ורישום משפטי - טאבו, רמ\"י והערות אזהרה",
    shortTitle: "ביטחונות ורישום",
    summary:
      "נסח טאבו מול אישור זכויות מרמ\"י או מחברה משכנת, מה זו הערת אזהרה, ולמה דרגת שעבוד קובעת מי נפרע ראשון במימוש.",
    icon: "file-text",
  },
  {
    slug: "prepayment",
    order: 8,
    title: "עמלות פירעון מוקדם, תפעול והיוון",
    shortTitle: "פירעון מוקדם",
    summary:
      "חישוב מדויק של עמלת היוון שלב-אחר-שלב, מתי היא לא חלה כלל, ומה ההבדל בינה לבין עמלת התפעול ועמלת אי-ההודעה המוקדמת.",
    icon: "receipt",
  },
  {
    slug: "refinancing",
    order: 9,
    title: "מחזור משכנתא, גרירה והקפאת תשלומים",
    shortTitle: "מחזור וגרירה",
    summary:
      "ההבדל בין מחזור (הלוואה חדשה) לגרירה (שימור התנאים לנכס חדש) להקפאת תשלומים זמנית - עם מפת החלטה למתי כל פתרון מתאים.",
    icon: "repeat",
  },
  {
    slug: "taxation",
    order: 10,
    title: "מיסוי מקרקעין - מס רכישה, מס שבח והיטל השבחה",
    shortTitle: "מיסוי מקרקעין",
    summary:
      "מדרגות מס הרכישה המלאות לפי מעמד הרוכש, תנאי הפטור ממס שבח לדירה יחידה, והבדל בין מסי המדינה לבין היטל ההשבחה העירוני.",
    icon: "coins",
  },
];

export function getLearnModule(slug: string): LearnModule | undefined {
  return LEARN_MODULES.find((m) => m.slug === slug);
}

// Maps each glossary category (see ConceptsExplorer's CATEGORY_ORDER) to the
// /learn module that covers it in depth, so a concept card can link straight
// to the relevant course chapter.
const CATEGORY_TO_MODULE_SLUG: Record<string, string> = {
  "מושגי יסוד": "regulation",
  "ריביות ומסלולים": "interest-tracks",
  "הצמדה ומדדים": "interest-tracks",
  "שיטות החזר, גרייס ובלון": "amortization",
  "יחס מימון, יחס החזר ועומס חוב": "pti-ltv",
  "מטרת ההלוואה וסוגי מימון": "regulation",
  "תהליך האישור והביצוע": "regulation",
  שמאות: "appraisal",
  "טאבו ורישום זכויות": "collateral-legal",
  "מושע, הסכם שיתוף ופרצלציה": "collateral-legal",
  "שעבודים ובטוחות": "collateral-legal",
  "סילוק, מכתב כוונות ופירעון מוקדם": "prepayment",
  "מחזור וגרירת משכנתא": "refinancing",
  ביטוחים: "collateral-legal",
  "אשראי ויכולת החזר": "pti-ltv",
  "רכישה מקבלן": "regulation",
  "עלויות ומסים נלווים": "taxation",
  'רגולציה - הוראה 329 והלוואת מיגון': "regulation",
};

export function getLearnModuleSlugForCategory(
  category: string | undefined,
): string | undefined {
  if (!category) return undefined;
  return CATEGORY_TO_MODULE_SLUG[category];
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
