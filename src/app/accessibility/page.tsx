import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות, תנאי שימוש ומדיניות פרטיות | Samama Mortgage",
  description:
    "הצהרת נגישות, מדיניות פרטיות ותנאי שימוש באתר Samama Mortgage.",
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold text-brand-navy">
        הצהרת נגישות, תנאי שימוש ומדיניות פרטיות
      </h1>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-brand-gold">
          הצהרת נגישות
        </h2>
        <p className="leading-8 text-brand-navy/90">
          אתר זה פועל מתוך מחויבות למתן שירות נגיש לכלל הציבור, לרבות אנשים
          עם מוגבלויות. באתר מותקן רכיב נגישות המאפשר התאמת התצוגה והניווט.
          במידה ונתקלתם בבעיית נגישות או שיש לכם הצעה לשיפור, נשמח שתפנו
          אלינו בדוא&quot;ל:{" "}
          <a
            href="mailto:accessibility@samama-mortgage.co.il"
            className="font-medium text-brand-navy underline underline-offset-4 hover:text-brand-gold"
          >
            accessibility@samama-mortgage.co.il
          </a>{" "}
          או בטלפון:{" "}
          <a
            href="tel:+972000000000"
            className="font-medium text-brand-navy underline underline-offset-4 hover:text-brand-gold"
          >
            03-0000000
          </a>{" "}
          כדי שנוכל לטפל בנושא בהקדם.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-brand-gold">
          מדיניות פרטיות
        </h2>
        <p className="leading-8 text-brand-navy/90">
          פרטים אישיים המושארים באתר (כגון שם, טלפון, וכתובת דוא&quot;ל
          בטפסי יצירת קשר או הרשמה) משמשים אך ורק לצורך מתן השירות, מענה
          לפניות ושיפור חווית המשתמש. המידע אינו נמסר לצדדים שלישיים ללא
          הסכמת המשתמש, למעט לצורך תפעול השירות.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-brand-gold">
          תנאי שימוש
        </h2>
        <p className="leading-8 text-brand-navy/90">
          השימוש באתר ובסרטונים/התכנים המוצגים בו הינו כפי שהוא (As-Is).
          הנהלת האתר עושה כמיטב יכולתה להבטיח את תקינות השירות ודיוק המידע.
        </p>
      </section>
    </div>
  );
}
