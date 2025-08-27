'use client';

import { useState, useRef } from 'react';
import { Share2, Download, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface ResultDisplayProps {
  result: {
    score: number;
    message: string;
    poseData: any;
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

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

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('URL이 복사되었습니다!');
    } catch (error) {
      console.error('URL 복사 오류:', error);
      alert('URL 복사에 실패했습니다.');
    }
  };

  const handleDownload = async () => {
    setIsGeneratingImage(true);
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
      ctx.fillText('결과!', canvas.width / 2, 80);
      
      // 점수
      ctx.fillStyle = '#22c55e'; // green-500
      ctx.font = 'bold 72px Arial';
      ctx.fillText(`${result.score}%`, canvas.width / 2, 220);
      
      // 메시지
      ctx.fillStyle = '#1f2937'; // gray-800
      ctx.font = '18px Arial';
      ctx.fillText(result.message, canvas.width / 2, 280);
      
      // 프로그레스 바 배경
      ctx.fillStyle = '#e5e7eb'; // gray-200
      ctx.fillRect(50, 320, 500, 12);
      
      // 프로그레스 바
      ctx.fillStyle = '#f97316'; // orange-500
      ctx.fillRect(50, 320, (500 * result.score) / 100, 12);
      
      // 비교 제목
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('비교', canvas.width / 2, 380);
      
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
      ctx.fillText('예시', 175, 620);
      
      // 사용자 이미지
      ctx.drawImage(userImg, 350, 400, 150, 200);
      ctx.fillText('당신', 425, 620);
      
      // 다운로드
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 0.9);
      link.download = `부처님자세-${result.score}점.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
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
          <h2 className="text-2xl font-bold mb-2">결과!</h2>
        </div>

        {/* 점수 표시 */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold mb-2">
              <span className={getScoreColor(result.score)}>
                {result.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {result.message}
            </p>
          </div>

          {/* 이미지 비교 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              비교
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Image
                  src="/images/reference-model.jpg"
                  alt="기준 모델"
                  width={120}
                  height={160}
                  className="rounded-lg shadow-md mx-auto"
                />
                <p className="text-xs text-gray-600 mt-1">예시</p>
              </div>
              <div className="text-center">
                <img 
                  src={originalImage || ''} 
                  alt="당신의 자세" 
                  className="w-[120px] h-[160px] object-cover rounded-lg shadow-md mx-auto"
                />
                <p className="text-xs text-gray-600 mt-1">당신</p>
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
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Share2 size={14} className="inline mr-1" />
          친구와 함께
        </button>

        {/* 다운로드 */}
        <button
          onClick={handleDownload}
          disabled={isGeneratingImage}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
        >
          {isGeneratingImage ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2 inline"></div>
              이미지 생성 중...
            </>
          ) : (
            <>
              <Download size={14} className="inline mr-1" />
              결과 이미지 저장
            </>
          )}
        </button>

        {/* 다시 시작 */}
        <button
          onClick={onReset}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          <RotateCcw size={14} className="inline mr-1" />
          다시 하기
        </button>
      </div>
    </div>
  );
}
