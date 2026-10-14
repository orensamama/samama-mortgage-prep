import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-brand-cream/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Samama Mortgage"
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-lg object-contain"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-brand-navy">
              Samama Mortgage
            </span>
            <span className="text-xs font-medium text-brand-gold">
              הכנה למבחן התאחדות יועצי המשכנתאות
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-brand-navy">
          <Link href="/" className="hover:text-brand-gold">
            בית
          </Link>
          <Link
            href="/"
            className="rounded-full bg-brand-navy px-5 py-2.5 text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            התחילו ללמוד
          </Link>
        </nav>
      </div>
    </header>
  );
}
