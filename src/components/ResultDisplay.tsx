'use client';

import React, { useState, useRef } from 'react';
import { Share2, Download, RotateCcw, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackUrlCopy, trackImageDownload, trackPoseAnalysis, trackPerfectMatch } from '@/lib/gtag';

interface ResultDisplayProps {
  result: {
    score: number;
    message: string;
    messageKey?: string;
    poseData: {
      keypoints: Array<{
        name?: string;
        x: number;
        y: number;
        score?: number;
      }>;
      confidence: number;
    };
    comparisonDetails: {
      legPosition: number;
      armPosition: number;
      handPosition: number;
      bodyPosture: number;
      overallSimilarity: number;
    };
  };
  originalImage: string | null;
  onReset: () => void;
}

export default function ResultDisplay({ result, originalImage, onReset }: ResultDisplayProps) {
  const { t } = useLanguage();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  // GA 이벤트 추적 - 분석 결과 표시 시
  React.useEffect(() => {
    trackPoseAnalysis(result.score);
    
    // 100% 매치인 경우 특별 이벤트 추적
    if (result.score === 100) {
      trackPerfectMatch();
    }
  }, [result.score]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 95) return '🎯';
    if (score >= 90) return '🌟';
    if (score >= 80) return '🧘‍♂️';
    if (score >= 70) return '💪';
    if (score >= 60) return '📚';
    if (score >= 50) return '🚶‍♀️';
    if (score >= 30) return '🤔';
    return '🌱';
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyUrl = async () => {
    const url = window.location.href;
    
    // GA 이벤트 추적
    trackUrlCopy();
    
    try {
      // 모던 브라우저의 Clipboard API 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        showToastMessage(t('urlCopied'));
        return;
      }
      
      // 폴백: 구식 방법 (모바일/구형 브라우저용)
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showToastMessage(t('urlCopied'));
      } else {
        throw new Error('execCommand failed');
      }
    } catch (error) {
      console.error('URL 복사 오류:', error);
      // 최종 폴백: 사용자에게 수동 복사 안내
      showToastMessage('URL을 수동으로 복사해주세요: ' + url.substring(0, 50) + '...');
    }
  };

  const handleDownload = async () => {
    setIsGeneratingImage(true);
    
    // GA 이벤트 추적
    trackImageDownload(result.score);
    
    try {
      // Canvas 생성
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // 캔버스 크기 설정
      canvas.width = 600;
      canvas.height = 800;
      
      // 배경
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 헤더 배경
      ctx.fillStyle = '#f97316'; // orange-500
      ctx.fillRect(0, 0, canvas.width, 120);
      
      // 헤더 텍스트
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(t('result'), canvas.width / 2, 80);
      
      // 점수
      ctx.fillStyle = '#22c55e'; // green-500
      ctx.font = 'bold 72px Arial';
      ctx.fillText(`${result.score}%`, canvas.width / 2, 220);
      
      // 메시지 (현재 언어 기준으로 messageKey 우선 적용)
      const messageToDraw = result.messageKey ? t(result.messageKey) : result.message;
      ctx.fillStyle = '#1f2937'; // gray-800
      ctx.font = '18px Arial';
      ctx.fillText(messageToDraw, canvas.width / 2, 280);
      
      // 프로그레스 바 배경
      ctx.fillStyle = '#e5e7eb'; // gray-200
      ctx.fillRect(50, 320, 500, 12);
      
      // 프로그레스 바
      ctx.fillStyle = '#f97316'; // orange-500
      ctx.fillRect(50, 320, (500 * result.score) / 100, 12);
      
      // 비교 제목
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(t('comparison'), canvas.width / 2, 380);
      
      // 이미지 로드 및 그리기
      const referenceImg = new window.Image();
      const userImg = new window.Image();
      
      await Promise.all([
        new Promise((resolve) => {
          referenceImg.onload = resolve;
          referenceImg.src = '/images/reference-model.jpg';
        }),
        new Promise((resolve) => {
          userImg.onload = resolve;
          userImg.src = originalImage || '';
        })
      ]);
      
      // 기준 모델 이미지
      ctx.drawImage(referenceImg, 100, 400, 150, 200);
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(t('example'), 175, 620);
      
      // 사용자 이미지
      ctx.drawImage(userImg, 350, 400, 150, 200);
      ctx.fillText(t('you'), 425, 620);
      
      // 다운로드
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 0.9);
      link.download = `like_buddha_${result.score}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      showToastMessage(t('imageGenerationFailed'));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 캡처할 영역 */}
      <div ref={resultRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 결과 헤더 */}
        <div className="bg-orange-500 p-6 text-white text-center">
          <div className="text-4xl mb-2">{getScoreEmoji(result.score)}</div>
          <h2 className="text-2xl font-bold mb-2">{t('result')}</h2>
        </div>

        {/* 점수 표시 */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold mb-2">
              <span className={getScoreColor(result.score)}>
                {result.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {result.messageKey ? t(result.messageKey) : result.message}
            </p>
          </div>

          {/* 이미지 비교 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {t('comparison')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Image
                  src="/images/reference-model.jpg"
                  alt={t('referenceModel')}
                  width={150}
                  height={200}
                  className="rounded-lg shadow-md mx-auto"
                />
                <p className="text-xs text-gray-600 mt-1">{t('example')}</p>
              </div>
              <div className="text-center">
                <img 
                  src={originalImage || ''} 
                  alt={t('yourPose')} 
                  className="w-[150px] h-[200px] object-cover rounded-lg shadow-md mx-auto"
                />
                <p className="text-xs text-gray-600 mt-1">{t('you')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3 mt-6">
        {/* URL 복사 */}
        <button
          onClick={handleCopyUrl}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center min-h-[44px]"
        >
          <Share2 size={16} className="mr-2" />
          {t('shareWithFriends')}
        </button>

        {/* 다운로드 */}
        <button
          onClick={handleDownload}
          disabled={isGeneratingImage}
          className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm flex items-center justify-center min-h-[44px]"
        >
          {isGeneratingImage ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t('generatingImage')}
            </>
          ) : (
            <>
              <Download size={16} className="mr-2" />
              {t('saveResultImage')}
            </>
          )}
        </button>

        {/* 다시 시작 */}
        <button
          onClick={onReset}
          className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center justify-center min-h-[44px]"
        >
          <RotateCcw size={16} className="mr-2" />
          {t('tryAgain')}
        </button>
      </div>

      {/* 작품 정보 섹션 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {t('artworkTitle')}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('artworkDescription')}
          </p>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {t('locationName')}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center mb-3">
            {t('locationAddress')}
          </p>
          <div className="text-center">
            <div className="w-full h-32 rounded-lg overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5!2d126.9794!3d37.5236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158e1df4ffd%3A0x7c0b0b0b0b0b0b0b!2z6rWQ7ZmU64yA7ZWZ6rWQ!5e0!3m2!1sko!2skr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="국립중앙박물관"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 알림 */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
