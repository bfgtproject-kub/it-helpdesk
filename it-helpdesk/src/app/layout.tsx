import type { Metadata } from "next";
import { Noto_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import AmbientOrbs from "@/components/AmbientOrbs";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "IT Helpdesk",
  description: "AI-Powered Automated IT Help Desk and Asset Management System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${notoSerifThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-deep focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          ข้ามไปเนื้อหาหลัก
        </a>
        <AmbientOrbs />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
