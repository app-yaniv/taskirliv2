import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const rubik = Rubik({ subsets: ["hebrew"] });

export const metadata: Metadata = {
  title: "טסקירלי - השכרת ציוד",
  description: "השוק הגדול ביותר להשכרת ציוד בישראל. מצלמות, ציוד קמפינג ועוד.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={rubik.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
