import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomePage from '../page'

// 지원하는 언어 목록
const supportedLanguages = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw']

// 언어별 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  
  if (!supportedLanguages.includes(lang)) {
    return {}
  }
  
  const baseUrl = 'https://like-buddha.vercel.app'
  
  const titles = {
    ko: "반가사유상 자세 따라하기 | 국립중앙박물관 사유의방 미륵상 체험",
    en: "Pensive Bodhisattva Pose Challenge | National Museum of Korea Meditation Room Experience",
    ja: "半跏思惟像ポーズチャレンジ | 国立中央博物館思惟の間体験",
    'zh-cn': "思惟像姿势挑战 | 国立中央博物馆思惟室体验",
    'zh-tw': "思惟像姿勢挑戰 | 國立中央博物館思惟室體驗"
  }
  
  const descriptions = {
    ko: "국립중앙박물관 사유의방에 전시된 국보 제83호 금동미륵보살반가사유상! 사진을 업로드하고 불교 미륵상의 자세와 얼마나 비슷한지 AI로 분석받아보세요. 7세기 통일신라 불교조각의 걸작을 체험해보세요.",
    en: "Experience Korea's National Treasure No. 83, the Gilt-bronze Pensive Bodhisattva from the Meditation Room at the National Museum of Korea! Upload your photo and get AI analysis of how similar your pose is to this Buddhist Maitreya statue. Discover this masterpiece of 7th century Unified Silla Buddhist sculpture.",
    ja: "国立中央博物館思惟の間に展示されている国宝第83号金銅弥勒菩薩半跏思惟像を体験！写真をアップロードして、仏教弥勒像のポーズとどれくらい似ているかAIで分析してもらいましょう。7世紀統一新羅仏教彫刻の傑作を体験してください。",
    'zh-cn': "体验国立中央博物馆思惟室展出的国宝第83号金铜弥勒菩萨半跏思惟像！上传照片，通过AI分析你的姿势与佛教弥勒像的相似度。发现7世纪统一新罗佛教雕刻杰作。",
    'zh-tw': "體驗國立中央博物館思惟室展出的國寶第83號金銅彌勒菩薩半跏思惟像！上傳照片，透過AI分析你的姿勢與佛教彌勒像的相似度。發現7世紀統一新羅佛教雕刻傑作。"
  }
  
  const keywords = {
    ko: "국립중앙박물관, 사유의방, 불교, 반가사유상, 미륵상, 금동미륵보살반가사유상, 국보 제83호, 통일신라, 불교조각, 미륵보살, 자세체험, 문화체험, 서울박물관, 용산박물관, 불교미술, 고대조각",
    en: "National Museum of Korea, Meditation Room, Buddhism, Pensive Bodhisattva, Maitreya, Gilt-bronze Pensive Bodhisattva, National Treasure No. 83, Unified Silla, Buddhist sculpture, Bodhisattva, pose experience, cultural experience, Seoul museum, Yongsan museum, Buddhist art, ancient sculpture",
    ja: "国立中央博物館, 思惟の間, 仏教, 半跏思惟像, 弥勒菩薩, 金銅弥勒菩薩半跏思惟像, 国宝第83号, 統一新羅, 仏教彫刻, 弥勒菩薩, ポーズ体験, 文化体験, ソウル博物館, 龍山博物館, 仏教美術, 古代彫刻",
    'zh-cn': "国立中央博物馆, 思惟室, 佛教, 半跏思惟像, 弥勒菩萨, 金铜弥勒菩萨半跏思惟像, 国宝第83号, 统一新罗, 佛教雕刻, 弥勒菩萨, 姿势体验, 文化体验, 首尔博物馆, 龙山博物馆, 佛教艺术, 古代雕刻",
    'zh-tw': "國立中央博物館, 思惟室, 佛教, 半跏思惟像, 彌勒菩薩, 金銅彌勒菩薩半跏思惟像, 國寶第83號, 統一新羅, 佛教雕刻, 彌勒菩薩, 姿勢體驗, 文化體驗, 首爾博物館, 龍山博物館, 佛教藝術, 古代雕刻"
  }
  
  const locales = {
    ko: 'ko_KR',
    en: 'en_US', 
    ja: 'ja_JP',
    'zh-cn': 'zh_CN',
    'zh-tw': 'zh_TW'
  }
  
  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
    keywords: keywords[lang as keyof typeof keywords],
    authors: [{ name: "Like Buddha" }],
    creator: "Like Buddha",
    publisher: "Like Buddha",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'ko': baseUrl,
        'en': `${baseUrl}/en`,
        'ja': `${baseUrl}/ja`,
        'zh-CN': `${baseUrl}/zh-cn`,
        'zh-TW': `${baseUrl}/zh-tw`,
      },
    },
    openGraph: {
      title: titles[lang as keyof typeof titles],
      description: descriptions[lang as keyof typeof descriptions],
      url: `${baseUrl}/${lang}`,
      siteName: 'Like Buddha',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: titles[lang as keyof typeof titles],
        },
      ],
      locale: locales[lang as keyof typeof locales],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang as keyof typeof titles],
      description: descriptions[lang as keyof typeof descriptions],
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
  }
}

// 정적 경로 생성
export async function generateStaticParams() {
  return supportedLanguages.map((lang) => ({
    lang: lang,
  }))
}

export default async function LanguagePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  if (!supportedLanguages.includes(lang)) {
    notFound()
  }
  
  return <HomePage />
}
