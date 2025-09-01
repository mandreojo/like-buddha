import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://like-buddha.vercel.app'
  const languages = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw']
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // 메인 페이지 (한국어)
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  // 언어별 페이지
  languages.forEach((lang, index) => {
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: lang === 'ko' ? 0.9 : 0.8 - (index * 0.1),
    })
  })
  
  return sitemapEntries
}
