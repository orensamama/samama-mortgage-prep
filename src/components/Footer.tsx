import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-navy/10 bg-brand-navy text-brand-cream/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Samama Mortgage"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-brand-cream">Samama Mortgage</span>
            <span className="text-xs text-brand-cream/60">
              © 2026 כל הזכויות שמורות
            </span>
          </div>
        </div>

        <Link
          href="/accessibility"
          className="text-sm font-medium text-brand-gold-light underline-offset-4 hover:underline"
        >
          הצהרת נגישות, תנאי שימוש ומדיניות פרטיות
        </Link>
      </div>
    </footer>
  );
}
