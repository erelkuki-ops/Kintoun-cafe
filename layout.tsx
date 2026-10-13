import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["400","500","600","700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["300","400","500","600","700","800"] });

export const metadata: Metadata = {
  title: "KINTOUN Coffee Malang Galunggung — Coffee Shop di Malang",
  description: "KINTOUN Coffee Malang Galunggung — coffee shop di Jl. Galunggung No.38, Gading Kasri, Klojen, Kota Malang. Harga Rp1–25.000/orang, tutup 22.00.",
  keywords: ["KINTOUN Coffee","coffee shop Malang","kopi Malang","Galunggung","Kopi Susu Kintoun","KSK"],
  openGraph: {
    title: "KINTOUN Coffee Malang Galunggung",
    description: "Coffee in hand, the world's at ease. Coffee shop hangat di Galunggung, Malang.",
    type: "website",
    locale: "id_ID",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="bg-[#fffbf1] text-[#0a365d] antialiased" style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
