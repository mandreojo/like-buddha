import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Like Buddha - 부처님 자세 따라하기",
  description: "사진을 업로드하고 부처님 자세와 얼마나 비슷한지 점수를 받아보세요!",
  keywords: "부처님, 자세, 스트레칭, AI, 자세분석, 점수, 반가사유상, 사유의방, 국중박, 국립중앙박물관, 불교",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
