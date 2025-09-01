'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'ja' | 'zh-cn' | 'zh-tw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {
    title: 'Like Buddha',
    subtitle: '부처는 모두의 마음 속에 있습니다\n자세부터 부처님이 되어볼까요?',
    example: '예시',
    reference: '대한민국 국보 제83호. 금동미륵보살반가사유상',
    uploadTitle: '사진 업로드',
    uploadDesc: '이 자세 따라해서 찍은 사진을 올려보세요',
    selectPhoto: '사진 선택',
    analyzing: 'AI 분석 중...',
    loadingModel: '모델을 로딩하고 있습니다...',
    analyzingImage: '이미지를 분석하고 있습니다...',
    comparingPose: '자세를 비교하고 있습니다...',
    analysisComplete: '분석 완료!',
    result: '결과!',
    comparison: '비교',
    you: '당신',
    shareWithFriends: '친구와 함께',
    saveResultImage: '결과 이미지 저장',
    generatingImage: '이미지 생성 중...',
    tryAgain: '다시 하기',
    creator: '만든이 : 솜율애비',
                    // 점수별 메시지
                perfectMatch: '완벽한 반가사유 자세! 🎯✨',
                almostPerfect: '거의 완벽해요! 손이 뺨에 닿는 자세가 정말 좋아요! 🌟',
                veryGood: '매우 좋아요! 다리 교차와 상체 기울기가 자연스러워요! 🧘‍♂️',
                good: '좋은 자세예요! 반가사유의 핵심 요소들이 잘 표현되었어요! 💪',
                okay: '괜찮아요! 손 위치를 조금 더 뺨 쪽으로 가져가보세요! 📚',
                needEffort: '조금 더 노력해요! 다리를 교차하고 상체를 기울여보세요! 🚶‍♀️',
                needPractice: '연습이 필요해요! 반가사유 자세의 기본을 다시 한번 확인해보세요! 🤔',
                detectedButDifferent: '사람이 감지되었지만 자세가 다르네요! 반가사유 자세를 참고해보세요! 😅',
                noPersonDetected: '사람이 감지되지 않았어요! 📸',
    // 오류 메시지
    urlCopied: 'URL이 복사되었습니다!',
    urlCopyFailed: 'URL 복사에 실패했습니다.',
    imageGenerationFailed: '이미지 생성에 실패했습니다. 다시 시도해주세요.',
    noPersonFound: '사람이 감지되지 않았습니다.',
    insufficientBodyParts: '충분한 신체 부위가 감지되지 않았습니다. 더 명확한 사진을 사용해주세요.',
    clearerPhoto: '더 명확한 사진을 사용해주세요! 📷',
                    personNotVisible: '사람이 화면에 제대로 보이지 않아요! 👤',
                // 파일명 및 alt 텍스트
                buddhaPose: '부처님자세',
                score: '점',
                referenceModel: '기준 모델',
                yourPose: '당신의 자세',
                // 작품 정보
                artworkTitle: '금동미륵보살반가사유상',
                artworkDescription: '대한민국 국보 제83호. 7세기 통일신라시대 작품으로, 깊은 사색에 잠긴 미륵보살의 모습을 표현한 불교 조각의 걸작입니다.',
                locationName: '국립중앙박물관',
                locationAddress: '서울특별시 용산구 서빙고로 137',
                viewOnMap: '지도에서 보기',
    language: 'Language'
              },
  en: {
    title: 'Like Buddha',
    subtitle: 'Buddha is in everyone\'s heart\nLet\'s start with the pose?',
    example: 'Example',
    reference: 'National Treasure of Korea No. 83. Gilt-bronze Pensive Bodhisattva',
    uploadTitle: 'Upload Photo',
    uploadDesc: 'Upload a photo of you mimicking this pose',
    selectPhoto: 'Select Photo',
    analyzing: 'AI Analyzing...',
    loadingModel: 'Loading model...',
    analyzingImage: 'Analyzing image...',
    comparingPose: 'Comparing poses...',
    analysisComplete: 'Analysis complete!',
    result: 'Result!',
    comparison: 'Comparison',
    you: 'You',
    shareWithFriends: 'Share with Friends',
    saveResultImage: 'Save Result Image',
    generatingImage: 'Generating image...',
    tryAgain: 'Try Again',
    creator: 'Created by : Somyul Aebi',
                    // 점수별 메시지
                perfectMatch: 'Perfect Pensive Bodhisattva pose! 🎯✨',
                almostPerfect: 'Almost perfect! The hand touching the cheek is really good! 🌟',
                veryGood: 'Very good! The crossed legs and tilted posture are natural! 🧘‍♂️',
                good: 'Good posture! The core elements of Pensive Bodhisattva were well expressed! 💪',
                okay: 'Okay! Try bringing your hand closer to your cheek! 📚',
                needEffort: 'Need more effort! Cross your legs and tilt your upper body! 🚶‍♀️',
                needPractice: 'Need practice! Review the basics of Pensive Bodhisattva pose! 🤔',
                detectedButDifferent: 'Person detected but pose is different! Try referencing the Pensive Bodhisattva pose! 😅',
                noPersonDetected: 'No person detected! 📸',
    // 오류 메시지
    urlCopied: 'URL copied!',
    urlCopyFailed: 'URL copy failed.',
    imageGenerationFailed: 'Image generation failed. Please try again.',
    noPersonFound: 'No person detected.',
    insufficientBodyParts: 'Insufficient body parts detected. Please use a clearer photo.',
    clearerPhoto: 'Please use a clearer photo! 📷',
                    personNotVisible: 'Person is not clearly visible! 👤',
                // 파일명 및 alt 텍스트
                buddhaPose: 'Buddha Pose',
                score: 'points',
                referenceModel: 'Reference Model',
                yourPose: 'Your Pose',
                // 작품 정보
                artworkTitle: 'Gilt-bronze Pensive Bodhisattva',
                artworkDescription: 'National Treasure of Korea No. 83. A masterpiece of Buddhist sculpture from the 7th century Unified Silla period, depicting the Pensive Bodhisattva in deep contemplation.',
                locationName: 'National Museum of Korea',
                locationAddress: '137 Seobinggo-ro, Yongsan-gu, Seoul',
                viewOnMap: 'View on Map',
    language: 'Language'
              },
  ja: {
    title: 'Like Buddha',
    subtitle: '仏は皆の心の中にあります\n姿勢から仏様になってみましょうか？',
    example: '例',
    reference: '大韓民国国宝第83号。金銅弥勒菩薩半跏思惟像',
    uploadTitle: '写真アップロード',
    uploadDesc: 'この姿勢を真似して撮った写真をアップロードしてください',
    selectPhoto: '写真選択',
    analyzing: 'AI分析中...',
    loadingModel: 'モデルを読み込み中...',
    analyzingImage: '画像を分析中...',
    comparingPose: '姿勢を比較中...',
    analysisComplete: '分析完了！',
    result: '結果！',
    comparison: '比較',
    you: 'あなた',
    shareWithFriends: '友達と共有',
    saveResultImage: '結果画像保存',
    generatingImage: '画像生成中...',
    tryAgain: 'もう一度',
    creator: '作成者 : ソムユル・エビ',
                    // 점수별 메시지
                perfectMatch: '完璧な半跏思惟の姿勢！🎯✨',
                almostPerfect: 'ほぼ完璧！頬に触れる手の姿勢が本当に良いです！🌟',
                veryGood: 'とても良い！足を組んだ姿勢と上半身の傾きが自然です！🧘‍♂️',
                good: '良い姿勢です！半跏思惟の核心要素がよく表現されています！💪',
                okay: 'まあまあ！手の位置をもう少し頬の方に持ってきてみてください！📚',
                needEffort: 'もう少し努力が必要！足を組んで上半身を傾けてみてください！🚶‍♀️',
                needPractice: '練習が必要！半跏思惟の基本をもう一度確認してみてください！🤔',
                detectedButDifferent: '人が検出されましたが姿勢が違います！半跏思惟の姿勢を参考にしてみてください！😅',
                noPersonDetected: '人が検出されませんでした！📸',
    // 오류 메시지
    urlCopied: 'URLがコピーされました！',
    urlCopyFailed: 'URLコピーに失敗しました。',
    imageGenerationFailed: '画像生成に失敗しました。もう一度お試しください。',
    noPersonFound: '人が検出されませんでした。',
    insufficientBodyParts: '十分な体の部位が検出されませんでした。より明確な写真を使用してください。',
    clearerPhoto: 'より明確な写真を使用してください！📷',
                    personNotVisible: '人が画面に正しく見えていません！👤',
                // 파일명 및 alt 텍스트
                buddhaPose: '仏様の姿勢',
                score: '点',
                referenceModel: '基準モデル',
                yourPose: 'あなたの姿勢',
                // 작품 정보
                artworkTitle: '金銅弥勒菩薩半跏思惟像',
                artworkDescription: '大韓民国国宝第83号。7世紀統一新羅時代の作品で、深い思索に沈む弥勒菩薩の姿を表現した仏教彫刻の傑作です。',
                locationName: '国立中央博物館',
                locationAddress: 'ソウル特別市龍山区西氷庫路137',
                viewOnMap: '地図で見る',
    language: 'Language'
              },
  'zh-cn': {
    title: 'Like Buddha',
    subtitle: '佛在每个人的心中\n让我们从姿势开始吧？',
    example: '示例',
    reference: '大韩民国国宝第83号。金铜弥勒菩萨半跏思惟像',
    uploadTitle: '上传照片',
    uploadDesc: '上传一张模仿这个姿势的照片',
    selectPhoto: '选择照片',
    analyzing: 'AI分析中...',
    loadingModel: '加载模型中...',
    analyzingImage: '分析图像中...',
    comparingPose: '比较姿势中...',
    analysisComplete: '分析完成！',
    result: '结果！',
    comparison: '比较',
    you: '你',
    shareWithFriends: '与朋友分享',
    saveResultImage: '保存结果图片',
    generatingImage: '生成图片中...',
    tryAgain: '再试一次',
    creator: '制作者 : 松月爱比',
                    // 점수별 메시지
                perfectMatch: '完美的半跏思惟姿势！🎯✨',
                almostPerfect: '几乎完美！手触脸颊的姿势真的很好！🌟',
                veryGood: '很好！交叉腿和上半身倾斜很自然！🧘‍♂️',
                good: '好姿势！半跏思惟的核心要素表达得很好！💪',
                okay: '还行！试着把手的位置更靠近脸颊！📚',
                needEffort: '需要更多努力！交叉双腿并倾斜上半身！🚶‍♀️',
                needPractice: '需要练习！重新检查半跏思惟姿势的基础！🤔',
                detectedButDifferent: '检测到人但姿势不同！试着参考半跏思惟姿势！😅',
                noPersonDetected: '未检测到人！📸',
    // 오류 메시지
    urlCopied: 'URL已复制！',
    urlCopyFailed: 'URL复制失败。',
    imageGenerationFailed: '图片生成失败。请重试。',
    noPersonFound: '未检测到人。',
    insufficientBodyParts: '检测到的身体部位不足。请使用更清晰的照片。',
    clearerPhoto: '请使用更清晰的照片！📷',
                    personNotVisible: '人在画面中不够清晰！👤',
                // 파일명 및 alt 텍스트
                buddhaPose: '佛像姿势',
                score: '分',
                referenceModel: '参考模型',
                yourPose: '你的姿势',
                // 작품 정보
                artworkTitle: '金铜弥勒菩萨半跏思惟像',
                artworkDescription: '大韩民国国宝第83号。7世纪统一新罗时代作品，表现陷入深思的弥勒菩萨形象的佛教雕刻杰作。',
                locationName: '国立中央博物馆',
                locationAddress: '首尔特别市龙山区西冰库路137',
                viewOnMap: '在地图中查看',
    language: 'Language'
              },
  'zh-tw': {
    title: 'Like Buddha',
    subtitle: '佛在每個人的心中\n讓我們從姿勢開始吧？',
    example: '範例',
    reference: '大韓民國國寶第83號。金銅彌勒菩薩半跏思惟像',
    uploadTitle: '上傳照片',
    uploadDesc: '上傳一張模仿這個姿勢的照片',
    selectPhoto: '選擇照片',
    analyzing: 'AI分析中...',
    loadingModel: '載入模型中...',
    analyzingImage: '分析圖像中...',
    comparingPose: '比較姿勢中...',
    analysisComplete: '分析完成！',
    result: '結果！',
    comparison: '比較',
    you: '你',
    shareWithFriends: '與朋友分享',
    saveResultImage: '儲存結果圖片',
    generatingImage: '產生圖片中...',
    tryAgain: '再試一次',
    creator: '製作者 : 松月愛比',
                    // 점수별 메시지
                perfectMatch: '完美的半跏思惟姿勢！🎯✨',
                almostPerfect: '幾乎完美！手觸臉頰的姿勢真的很好！🌟',
                veryGood: '很好！交叉腿和上半身傾斜很自然！🧘‍♂️',
                good: '好姿勢！半跏思惟的核心要素表達得很好！💪',
                okay: '還行！試著把手的位置更靠近臉頰！📚',
                needEffort: '需要更多努力！交叉雙腿並傾斜上半身！🚶‍♀️',
                needPractice: '需要練習！重新檢查半跏思惟姿勢的基礎！🤔',
                detectedButDifferent: '檢測到人但姿勢不同！試著參考半跏思惟姿勢！😅',
                noPersonDetected: '未檢測到人！📸',
    // 오류 메시지
    urlCopied: 'URL已複製！',
    urlCopyFailed: 'URL複製失敗。',
    imageGenerationFailed: '圖片產生失敗。請重試。',
    noPersonFound: '未檢測到人。',
    insufficientBodyParts: '檢測到的身體部位不足。請使用更清晰的照片。',
    clearerPhoto: '請使用更清晰的照片！📷',
                    personNotVisible: '人在畫面中不夠清晰！👤',
                // 파일명 및 alt 텍스트
                buddhaPose: '佛像姿勢',
                score: '分',
                referenceModel: '參考模型',
                yourPose: '你的姿勢',
                // 작품 정보
                artworkTitle: '金銅彌勒菩薩半跏思惟像',
                artworkDescription: '大韓民國國寶第83號。7世紀統一新羅時代作品，表現陷入深思的彌勒菩薩形象的佛教雕刻傑作。',
                locationName: '國立中央博物館',
                locationAddress: '首爾特別市龍山區西冰庫路137',
                viewOnMap: '在地圖中查看',
    language: 'Language'
              }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en'); // 기본값은 영어

  // 클라이언트에서만 언어 감지
  useEffect(() => {
    // navigator.languages 배열에서 지원하는 언어 찾기
    const languages = navigator.languages || [navigator.language];
    
    for (const lang of languages) {
      const langLower = lang.toLowerCase();
      
      // 한국어
      if (langLower.startsWith('ko')) {
        setLanguage('ko');
        return;
      }
      // 일본어
      if (langLower.startsWith('ja')) {
        setLanguage('ja');
        return;
      }
      // 중국어 간체
      if (langLower.startsWith('zh-cn') || langLower.startsWith('zh-hans')) {
        setLanguage('zh-cn');
        return;
      }
      // 중국어 번체
      if (langLower.startsWith('zh-tw') || langLower.startsWith('zh-hant')) {
        setLanguage('zh-tw');
        return;
      }
      // 영어
      if (langLower.startsWith('en')) {
        setLanguage('en');
        return;
      }
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
