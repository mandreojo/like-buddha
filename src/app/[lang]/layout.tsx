import { ReactNode } from 'react'

export default function LanguageLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { lang: string }
}) {
  const { lang } = params
  
  // 언어별 구조화된 데이터
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": {
      ko: "Like Buddha - 케이팝 데몬 헌터스 반가사유상 자세 따라하기",
      en: "Like Buddha - K-Pop Demon Hunters Buddha Pose Challenge",
      ja: "Like Buddha - K-POPデーモンハンターズ半跏思惟像ポーズチャレンジ",
      'zh-cn': "Like Buddha - K-POP恶魔猎手思惟像姿势挑战",
      'zh-tw': "Like Buddha - K-POP惡魔獵手思惟像姿勢挑戰"
    }[lang] || "Like Buddha",
    "description": {
      ko: "넷플릭스 '케이팝 데몬 헌터스'로 화제가 된 국립중앙박물관 반가사유상! AI로 내 자세와 얼마나 비슷한지 분석받아보세요.",
      en: "The National Museum of Korea's Pensive Bodhisattva statue that became a hot topic through Netflix's 'K-Pop Demon Hunters'! Get AI analysis of how similar your pose is to Buddha's.",
      ja: "Netflix『K-POPデーモンハンターズ』で話題になった国立中央博物館の半跏思惟像！AIで内のポーズとどれくらい似ているか分析してもらいましょう。",
      'zh-cn': "通过Netflix《K-POP恶魔猎手》成为热点的国立中央博物馆半跏思惟像！通过AI分析你的姿势与佛像的相似度。",
      'zh-tw': "透過Netflix《K-POP惡魔獵手》成為熱點的國立中央博物館半跏思惟像！透過AI分析你的姿勢與佛像的相似度。"
    }[lang] || "Like Buddha - Buddha Pose Challenge",
    "url": `https://like-buddha.vercel.app/${lang}`,
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
      "name": {
        ko: "금동미륵보살반가사유상",
        en: "Gilt-bronze Pensive Bodhisattva",
        ja: "金銅弥勒菩薩半跏思惟像",
        'zh-cn': "金铜弥勒菩萨半跏思惟像",
        'zh-tw': "金銅彌勒菩薩半跏思惟像"
      }[lang] || "Gilt-bronze Pensive Bodhisattva",
      "description": {
        ko: "대한민국 국보 제83호. 7세기 통일신라시대 작품으로, 깊은 사색에 잠긴 미륵보살의 모습을 표현한 불교 조각의 걸작",
        en: "National Treasure of Korea No. 83. A masterpiece of Buddhist sculpture from the 7th century Unified Silla period, depicting the Pensive Bodhisattva in deep contemplation.",
        ja: "大韓民国国宝第83号。7世紀統一新羅時代の作品で、深い思索に沈む弥勒菩薩の姿を表現した仏教彫刻の傑作です。",
        'zh-cn': "大韩民国国宝第83号。7世纪统一新罗时代作品，表现陷入深思的弥勒菩萨形象的佛教雕刻杰作。",
        'zh-tw': "大韓民國國寶第83號。7世紀統一新羅時代作品，表現陷入深思的彌勒菩薩形象的佛教雕刻傑作。"
      }[lang] || "National Treasure of Korea No. 83",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": {
            ko: "국보번호",
            en: "National Treasure Number",
            ja: "国宝番号",
            'zh-cn': "国宝编号",
            'zh-tw': "國寶編號"
          }[lang] || "National Treasure Number",
          "value": {
            ko: "제83호",
            en: "No. 83",
            ja: "第83号",
            'zh-cn': "第83号",
            'zh-tw': "第83號"
          }[lang] || "No. 83"
        },
        {
          "@type": "PropertyValue", 
          "name": {
            ko: "시대",
            en: "Period",
            ja: "時代",
            'zh-cn': "时代",
            'zh-tw': "時代"
          }[lang] || "Period",
          "value": {
            ko: "7세기 통일신라",
            en: "7th century Unified Silla",
            ja: "7世紀統一新羅",
            'zh-cn': "7世纪统一新罗",
            'zh-tw': "7世紀統一新羅"
          }[lang] || "7th century Unified Silla"
        },
        {
          "@type": "PropertyValue",
          "name": {
            ko: "소장처",
            en: "Museum",
            ja: "所蔵場所",
            'zh-cn': "收藏地",
            'zh-tw': "收藏地"
          }[lang] || "Museum",
          "value": {
            ko: "국립중앙박물관",
            en: "National Museum of Korea",
            ja: "国立中央博物館",
            'zh-cn': "国立中央博物馆",
            'zh-tw': "國立中央博物館"
          }[lang] || "National Museum of Korea"
        }
      ]
    },
    "mentions": [
      {
        "@type": "TVSeries",
        "name": {
          ko: "케이팝 데몬 헌터스",
          en: "K-Pop Demon Hunters",
          ja: "K-POPデーモンハンターズ",
          'zh-cn': "K-POP恶魔猎手",
          'zh-tw': "K-POP惡魔獵手"
        }[lang] || "K-Pop Demon Hunters",
        "description": {
          ko: "넷플릭스 오리지널 시리즈",
          en: "Netflix Original Series",
          ja: "Netflixオリジナルシリーズ",
          'zh-cn': "Netflix原创系列",
          'zh-tw': "Netflix原創系列"
        }[lang] || "Netflix Original Series",
        "provider": {
          "@type": "Organization",
          "name": "Netflix"
        }
      },
      {
        "@type": "Museum",
        "name": {
          ko: "국립중앙박물관",
          en: "National Museum of Korea",
          ja: "国立中央博物館",
          'zh-cn': "国立中央博物馆",
          'zh-tw': "國立中央博物館"
        }[lang] || "National Museum of Korea",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": {
            ko: "서울특별시 용산구 서빙고로 137",
            en: "137 Seobinggo-ro, Yongsan-gu, Seoul",
            ja: "ソウル特別市龍山区西氷庫路137",
            'zh-cn': "首尔特别市龙山区西冰库路137",
            'zh-tw': "首爾特別市龍山區西冰庫路137"
          }[lang] || "137 Seobinggo-ro, Yongsan-gu, Seoul",
          "addressCountry": "KR"
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}
