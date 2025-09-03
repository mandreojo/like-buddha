// Google Analytics 설정
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// gtag 함수 타입 정의
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// 앱 특화 이벤트들
export const trackImageUpload = (imageSize: number) => {
  event({
    action: 'image_upload',
    category: 'engagement',
    label: 'user_uploaded_image',
    value: imageSize,
  })
}

export const trackPoseAnalysis = (score: number) => {
  event({
    action: 'pose_analysis',
    category: 'engagement',
    label: 'analysis_completed',
    value: score,
  })
}

export const trackLanguageChange = (language: string) => {
  event({
    action: 'language_change',
    category: 'engagement',
    label: language,
  })
}

export const trackUrlCopy = () => {
  event({
    action: 'url_copy',
    category: 'engagement',
    label: 'share_button_clicked',
  })
}

export const trackImageDownload = (score: number) => {
  event({
    action: 'image_download',
    category: 'engagement',
    label: 'result_image_saved',
    value: score,
  })
}

export const trackPerfectMatch = () => {
  event({
    action: 'perfect_match',
    category: 'achievement',
    label: 'reference_image_uploaded',
  })
}
