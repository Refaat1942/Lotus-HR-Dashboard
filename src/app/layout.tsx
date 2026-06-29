import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { BrandingProvider } from "@/components/BrandingProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Lotus HR Dashboard | لوحة تحكم الموارد البشرية",
  description: "Lotus Pharmacies HR Job Application Management System",
  icons: {
    icon: "/lotus-logo-official.png",
    apple: "/lotus-logo-official.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>
        <LanguageProvider>
          <BrandingProvider>{children}</BrandingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
