'use client';

import { useState } from 'react';
import { Share2, Download, RotateCcw, Twitter, Facebook, Instagram } from 'lucide-react';
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🧘‍♀️✨';
    if (score >= 80) return '🌟';
    if (score >= 70) return '🧘‍♂️';
    if (score >= 60) return '💪';
    if (score >= 50) return '📚';
    if (score >= 30) return '🚶‍♀️';
    return '🌱';
  };

  const handleShare = async (platform: string) => {
    const text = `부처님 자세 점수: ${result.score}점! ${result.message}`;
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        alert('Instagram에서는 스토리나 포스트에 직접 업로드해주세요!');
        break;
    }
  };

  const handleDownload = async () => {
    setIsGeneratingImage(true);
    try {
      const link = document.createElement('a');
      link.href = originalImage || '';
      link.download = `buddha-pose-${result.score}점.jpg`;
      link.click();
    } catch (error) {
      console.error('다운로드 오류:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 결과 헤더 */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6 text-white text-center">
          <div className="text-4xl mb-2">{getScoreEmoji(result.score)}</div>
          <h2 className="text-2xl font-bold mb-2">결과!</h2>
        </div>

        {/* 점수 표시 */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="text-5xl font-bold mb-2">
              <span className={getScoreColor(result.score)}>
                {result.score}
              </span>
              <span className="text-gray-400 text-3xl">/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-orange-400 to-yellow-400 h-3 rounded-full transition-all duration-1000"
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

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            {/* SNS 공유 */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleShare('twitter')}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Twitter size={14} className="inline mr-1" />
                트위터
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Facebook size={14} className="inline mr-1" />
                페이스북
              </button>
              <button
                onClick={() => handleShare('instagram')}
                className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
              >
                <Instagram size={14} className="inline mr-1" />
                인스타
              </button>
            </div>

            {/* 다운로드 */}
            <button
              onClick={handleDownload}
              disabled={isGeneratingImage}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
            >
              {isGeneratingImage ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2 inline"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Download size={14} className="inline mr-1" />
                  이미지 저장
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
      </div>
    </div>
  );
}
