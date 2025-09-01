import { Metadata } from 'next'

export function generateMetadata(language: string = 'ko'): Metadata {
  const baseUrl = 'https://like-buddha.vercel.app'
  
  const titles = {
    ko: "Like Buddha - 케이팝 데몬 헌터스 반가사유상 자세 따라하기 | AI 자세 분석",
    en: "Like Buddha - K-Pop Demon Hunters Buddha Pose Challenge | AI Pose Analysis",
    ja: "Like Buddha - K-POPデーモンハンターズ半跏思惟像ポーズチャレンジ | AIポーズ分析",
    'zh-cn': "Like Buddha - K-POP恶魔猎手思惟像姿势挑战 | AI姿势分析",
    'zh-tw': "Like Buddha - K-POP惡魔獵手思惟像姿勢挑戰 | AI姿勢分析"
  }
  
  const descriptions = {
    ko: "넷플릭스 '케이팝 데몬 헌터스'로 화제가 된 국립중앙박물관 반가사유상! 사진을 업로드하고 부처님 자세와 얼마나 비슷한지 AI로 분석받아보세요. 대한민국 국보 제83호 금동미륵보살반가사유상 체험",
    en: "The National Museum of Korea's Pensive Bodhisattva statue that became a hot topic through Netflix's 'K-Pop Demon Hunters'! Upload your photo and get AI analysis of how similar your pose is to Buddha's. Experience Korea's National Treasure No. 83, the Gilt-bronze Pensive Bodhisattva.",
    ja: "Netflix『K-POPデーモンハンターズ』で話題になった国立中央博物館の半跏思惟像！写真をアップロードして、仏様のポーズとどれくらい似ているかAIで分析してもらいましょう。大韓民国国宝第83号金銅弥勒菩薩半跏思惟像を体験",
    'zh-cn': "通过Netflix《K-POP恶魔猎手》成为热点的国立中央博物馆半跏思惟像！上传照片，通过AI分析你的姿势与佛像的相似度。体验大韩民国国宝第83号金铜弥勒菩萨半跏思惟像",
    'zh-tw': "透過Netflix《K-POP惡魔獵手》成為熱點的國立中央博物館半跏思惟像！上傳照片，透過AI分析你的姿勢與佛像的相似度。體驗大韓民國國寶第83號金銅彌勒菩薩半跏思惟像"
  }
  
  const keywords = {
    ko: "케이팝 데몬 헌터스, 반가사유상, 국립중앙박물관, 사유의방, 부처님 자세, AI 자세분석, 금동미륵보살반가사유상, 대한민국 국보 제83호, 넷플릭스, 케이팝, 데몬헌터스, 불교조각, 미륵보살, 자세체험, 문화체험",
    en: "K-Pop Demon Hunters, Pensive Bodhisattva, National Museum of Korea, Buddha pose, AI pose analysis, Gilt-bronze Pensive Bodhisattva, Korea National Treasure No. 83, Netflix, K-Pop, Demon Hunters, Buddhist sculpture, Bodhisattva, pose experience, cultural experience",
    ja: "K-POPデーモンハンターズ, 半跏思惟像, 国立中央博物館, 仏様ポーズ, AIポーズ分析, 金銅弥勒菩薩半跏思惟像, 大韓民国国宝第83号, ネットフリックス, K-POP, デーモンハンターズ, 仏教彫刻, 弥勒菩薩, ポーズ体験, 文化体験",
    'zh-cn': "K-POP恶魔猎手, 半跏思惟像, 国立中央博物馆, 佛像姿势, AI姿势分析, 金铜弥勒菩萨半跏思惟像, 大韩民国国宝第83号, 网飞, K-POP, 恶魔猎手, 佛教雕刻, 弥勒菩萨, 姿势体验, 文化体验",
    'zh-tw': "K-POP惡魔獵手, 半跏思惟像, 國立中央博物館, 佛像姿勢, AI姿勢分析, 金銅彌勒菩薩半跏思惟像, 大韓民國國寶第83號, 網飛, K-POP, 惡魔獵手, 佛教雕刻, 彌勒菩薩, 姿勢體驗, 文化體驗"
  }
  
  const locales = {
    ko: 'ko_KR',
    en: 'en_US', 
    ja: 'ja_JP',
    'zh-cn': 'zh_CN',
    'zh-tw': 'zh_TW'
  }
  
  return {
    title: titles[language as keyof typeof titles] || titles.ko,
    description: descriptions[language as keyof typeof descriptions] || descriptions.ko,
    keywords: keywords[language as keyof typeof keywords] || keywords.ko,
    openGraph: {
      title: titles[language as keyof typeof titles] || titles.ko,
      description: descriptions[language as keyof typeof descriptions] || descriptions.ko,
      url: `${baseUrl}${language !== 'ko' ? `?lang=${language}` : ''}`,
      siteName: 'Like Buddha',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: titles[language as keyof typeof titles] || titles.ko,
        },
      ],
      locale: locales[language as keyof typeof locales] || locales.ko,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[language as keyof typeof titles] || titles.ko,
      description: descriptions[language as keyof typeof descriptions] || descriptions.ko,
      images: ['/twitter-image'],
      creator: '@likebuddha',
    },
    alternates: {
      canonical: `${baseUrl}${language !== 'ko' ? `?lang=${language}` : ''}`,
      languages: {
        'ko': baseUrl,
        'en': `${baseUrl}?lang=en`,
        'ja': `${baseUrl}?lang=ja`,
        'zh-CN': `${baseUrl}?lang=zh-cn`,
        'zh-TW': `${baseUrl}?lang=zh-tw`,
      },
    },
  }
}
