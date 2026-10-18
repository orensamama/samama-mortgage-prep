"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "בית" },
  { href: "/practice", label: "תרגול שאלות" },
  { href: "/topics", label: "לפי נושאים" },
  { href: "/concepts", label: "מילון משכנתאות" },
  { href: "/learn", label: "קורס מקצועי" },
  { href: "/open-questions", label: "שאלות פתוחות" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-brand-cream/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:h-24 sm:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.png"
            alt="Samama Mortgage"
            width={662}
            height={377}
            priority
            className="h-14 w-auto object-contain sm:h-20"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-lg font-bold tracking-tight text-brand-navy">
              Samama Mortgage
            </span>
            <span className="text-xs font-medium text-brand-gold">
              למידה ותרגול מקצועי בייעוץ משכנתאות
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-navy sm:flex">
          {NAV_LINKS.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-gold">
              {link.label}
            </Link>
          ))}
          <Link
            href="/practice"
            className="rounded-full bg-brand-navy px-5 py-2.5 text-brand-cream transition-colors hover:bg-brand-navy-light"
          >
            התחילו ללמוד
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "סגור תפריט" : "פתח תפריט"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy sm:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-navy/10 bg-brand-cream px-4 py-3 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-brand-navy hover:bg-brand-navy/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
