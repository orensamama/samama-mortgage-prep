import type { Metadata } from "next";
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
  title: "Samama Mortgage | הכנה למבחן התאחדות יועצי המשכנתאות",
  description:
    "מערכת הכנה ולמידה מתקדמת למבחן ההסמכה של התאחדות יועצי המשכנתאות בישראל.",
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
