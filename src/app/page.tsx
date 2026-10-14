import Image from "next/image";
import Link from "next/link";
import { BookOpen, Hash, Lightbulb, Timer } from "lucide-react";

const ACTION_CARDS = [
  {
    title: "תרגול שאלות מתוך מאגר ההתאחדות",
    description:
      "תרגלו מתוך מאגר שאלות רחב בכל נושאי המבחן, עם משוב מיידי והסבר לכל שאלה.",
    icon: BookOpen,
    href: "/practice",
    cta: "התחילו לתרגל",
  },
  {
    title: "סימולציית מבחן מלאה",
    description: "חוויית מבחן בתנאי אמת עם מגבלת זמן וציון סופי.",
    icon: Timer,
    href: null,
    cta: "בקרוב",
  },
  {
    title: "תרגול ממוקד לפי נושאים",
    description:
      "בחרו נושא או תגית ספציפיים, ותרגלו אך ורק את השאלות הרלוונטיות אליו.",
    icon: Hash,
    href: "/topics",
    cta: "בחרו נושא",
  },
  {
    title: "מרכז מושגים והרחבות רגולטוריות",
    description:
      "מילון מרוכז של מושגי מפתח ברגולציה ובחקיקה, עם רקע מעמיק ודוגמאות.",
    icon: Lightbulb,
    href: "/concepts",
    cta: "עיינו במושגים",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <section className="border-b border-brand-navy/10 bg-gradient-to-b from-brand-navy to-brand-navy-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center">
          <div className="mb-6 rounded-2xl bg-white p-2 shadow-xl">
            <Image
              src="/logo.png"
              alt="Samama Mortgage"
              width={662}
              height={377}
              priority
              className="h-20 w-auto object-contain sm:h-28"
            />
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-brand-cream sm:text-4xl">
            Samama Mortgage - הכנה למבחן ההתאחדות
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-brand-cream/70">
            הפלטפורמה שתלווה אתכם צעד אחר צעד להצלחה במבחן ההסמכה של התאחדות
            יועצי המשכנתאות.
          </p>
          <Link
            href="/practice"
            className="mt-8 rounded-full bg-brand-gold px-8 py-3 text-base font-semibold text-brand-navy shadow-lg transition-colors hover:bg-brand-gold-light"
          >
            תרגלו עכשיו
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-navy">
          איך תרצו להתחיל?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ACTION_CARDS.map(({ title, description, icon: Icon, href, cta }) => {
            const content = (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-gold">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-brand-navy">
                  {title}
                </h3>
                <p className="mb-4 text-sm leading-7 text-brand-navy/70">
                  {description}
                </p>
                <span
                  className={
                    href
                      ? "inline-flex text-sm font-semibold text-brand-gold"
                      : "inline-flex rounded-full bg-brand-navy/5 px-3 py-1 text-sm font-semibold text-brand-navy/50"
                  }
                >
                  {cta}
                </span>
              </>
            );

            if (!href) {
              return (
                <div
                  key={title}
                  className="rounded-2xl border border-brand-navy/10 bg-white/60 p-6 shadow-sm"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={title}
                href={href}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
