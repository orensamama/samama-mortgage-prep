import { BookOpen, ClipboardCheck, GraduationCap, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "חומר לימוד מקיף",
    description:
      "סיכומים ברורים לפי נושאי המבחן הרשמיים של התאחדות יועצי המשכנתאות.",
  },
  {
    icon: ClipboardCheck,
    title: "מבחני תרגול",
    description: "שאלות תרגול וסימולציות מבחן בתנאים הקרובים ביותר למבחן האמיתי.",
  },
  {
    icon: GraduationCap,
    title: "מעקב התקדמות",
    description: "ניתוח ביצועים אישי שמצביע בדיוק על הנושאים שדורשים חיזוק.",
  },
  {
    icon: ShieldCheck,
    title: "עדכני ומבוסס רגולציה",
    description: "תוכן המתעדכן בהתאם לשינויי חקיקה ורגולציה בענף המשכנתאות.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-brand-navy/10 bg-gradient-to-b from-brand-navy to-brand-navy-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-4 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-sm font-medium text-brand-gold-light">
            Samama Mortgage
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-brand-cream sm:text-5xl">
            ההכנה המקצועית שלכם למבחן יועצי המשכנתאות
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-brand-cream/70">
            פלטפורמת לימוד ותרגול מודרנית שתלווה אתכם צעד אחר צעד עד להצלחה
            במבחן ההסמכה של התאחדות יועצי המשכנתאות.
          </p>
          <a
            href="#features"
            className="mt-10 rounded-full bg-brand-gold px-8 py-3 text-base font-semibold text-brand-navy shadow-lg transition-colors hover:bg-brand-gold-light"
          >
            גלו איך זה עובד
          </a>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-2xl font-bold text-brand-navy">
          כל מה שצריך כדי להגיע מוכנים
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-gold">
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy">{title}</h3>
              <p className="text-sm leading-7 text-brand-navy/70">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
