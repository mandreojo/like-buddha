'use client';

import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { trackLanguageChange } from '@/lib/gtag';

const languages: { code: Language; flag: string; name: string; nativeName: string }[] = [
  { code: 'ko', flag: '🇰🇷', name: '한국어', nativeName: '한국어' },
  { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
  { code: 'ja', flag: '🇯🇵', name: '日本語', nativeName: '日本語' },
  { code: 'zh-cn', flag: '🇨🇳', name: '简体中文', nativeName: '简体中文' },
  { code: 'zh-tw', flag: '🇹🇼', name: '繁體中文', nativeName: '繁體中文' }
];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="flex items-center space-x-2">
      {/* 언어 라벨 */}
      <span className="text-sm font-medium text-gray-600">
        {t('language')}:
      </span>
      
      {/* 현재 선택된 언어 버튼 */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <span className="text-xl">{currentLanguage?.flag}</span>
          <span className="text-sm font-medium text-gray-700">{currentLanguage?.nativeName}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
                // GA 이벤트 추적
                trackLanguageChange(lang.code);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
                             <span className="text-sm font-medium">{lang.nativeName}</span>
              {language === lang.code && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

        {/* 배경 클릭 시 닫기 */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
