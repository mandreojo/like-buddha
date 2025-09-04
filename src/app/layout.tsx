import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

// 기본 메타데이터 (한국어)
export const metadata: Metadata = {
  title: "반가사유상 자세 따라하기 | 국립중앙박물관 사유의방 미륵상 체험",
  description: "국립중앙박물관 사유의방에 전시된 국보 제83호 금동미륵보살반가사유상! 사진을 업로드하고 불교 미륵상의 자세와 얼마나 비슷한지 AI로 분석받아보세요. 7세기 통일신라 불교조각의 걸작을 체험해보세요.",
  keywords: "국립중앙박물관, 사유의방, 불교, 반가사유상, 미륵상, 금동미륵보살반가사유상, 국보 제83호, 통일신라, 불교조각, 미륵보살, 자세체험, 문화체험, 서울박물관, 용산박물관, 불교미술, 고대조각",
  authors: [{ name: "Like Buddha" }],
  creator: "Like Buddha",
  publisher: "Like Buddha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://like-buddha.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'ko': '/',
      'en': '/',
      'ja': '/',
      'zh-CN': '/',
      'zh-TW': '/',
    },
  },
  openGraph: {
    title: "반가사유상 자세 따라하기 | 국립중앙박물관 사유의방 미륵상 체험",
    description: "국립중앙박물관 사유의방에 전시된 국보 제83호 금동미륵보살반가사유상! 사진을 업로드하고 불교 미륵상의 자세와 얼마나 비슷한지 AI로 분석받아보세요.",
    url: 'https://like-buddha.vercel.app',
    siteName: 'Like Buddha',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '반가사유상 자세 따라하기 | 국립중앙박물관 사유의방 미륵상 체험',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "반가사유상 자세 따라하기 | 국립중앙박물관 사유의방 미륵상 체험",
    description: "국립중앙박물관 사유의방에 전시된 국보 제83호 금동미륵보살반가사유상! 사진을 업로드하고 불교 미륵상의 자세와 얼마나 비슷한지 AI로 분석받아보세요.",
    images: ['/twitter-image'],
    creator: '@likebuddha',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "반가사유상 자세 따라하기 | 국립중앙박물관 사유의방 미륵상 체험",
    "description": "국립중앙박물관 사유의방에 전시된 국보 제83호 금동미륵보살반가사유상! 사진을 업로드하고 불교 미륵상의 자세와 얼마나 비슷한지 AI로 분석받아보세요.",
    "url": "https://like-buddha.vercel.app",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "creator": {
      "@type": "Organization",
      "name": "Like Buddha"
    },
    "about": {
      "@type": "Thing",
      "name": "금동미륵보살반가사유상",
      "description": "대한민국 국보 제83호. 7세기 통일신라시대 작품으로, 깊은 사색에 잠긴 미륵보살의 모습을 표현한 불교 조각의 걸작",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "국보번호",
          "value": "제83호"
        },
        {
          "@type": "PropertyValue", 
          "name": "시대",
          "value": "7세기 통일신라"
        },
        {
          "@type": "PropertyValue",
          "name": "소장처",
          "value": "국립중앙박물관"
        },
        {
          "@type": "PropertyValue",
          "name": "전시실",
          "value": "사유의방"
        },
        {
          "@type": "PropertyValue",
          "name": "종교",
          "value": "불교"
        },
        {
          "@type": "PropertyValue",
          "name": "상호명",
          "value": "미륵보살"
        }
      ]
    },
    "mentions": [
      {
        "@type": "Museum",
        "name": "국립중앙박물관",
        "description": "대한민국 최고의 국립박물관",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "서울특별시 용산구 서빙고로 137",
          "addressCountry": "KR"
        },
        "exhibit": {
          "@type": "Exhibit",
          "name": "사유의방",
          "description": "불교 미술품을 전시하는 특별 전시실"
        }
      },
      {
        "@type": "Place",
        "name": "용산",
        "description": "서울특별시 용산구",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "용산구",
          "addressRegion": "서울특별시",
          "addressCountry": "KR"
        }
      }
    ]
  };

  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="CMSuhtm_LEHG9JEKA2Vt-W4Khx-0KHIVq5L69uqhUzU" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}