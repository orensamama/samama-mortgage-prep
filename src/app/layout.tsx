import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "Samama Mortgage - למידה ותרגול מקצועי בייעוץ משכנתאות",
  description:
    "מערכת למידה ותרגול מקצועי בייעוץ משכנתאות: מילון מושגים, תרגול שאלות ותכנים רגולטוריים מעודכנים.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Samama Prep",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1b33",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-brand-cream font-sans text-brand-navy">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <AccessibilityToolbar />
      </body>
    </html>
  );
}
