'use client';

import { useState, useEffect } from 'react';
import { Upload, Camera, Sparkles, Share2, Trophy, Target } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import PoseAnalyzer from '@/components/PoseAnalyzer';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
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
  } | null>(null);
  const [isReferenceLoaded, setIsReferenceLoaded] = useState(false);

  // 앱 시작 시 기준 이미지 미리 로드
  useEffect(() => {
    const preloadReference = async () => {
      try {
        // 기준 이미지 미리 로드 (PoseAnalyzer에서 사용할 때 캐시됨)
        const img = new window.Image();
        img.src = '/images/reference-model.jpg';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        setIsReferenceLoaded(true);
        console.log('기준 이미지 미리 로드 완료');
      } catch (error) {
        console.error('기준 이미지 로드 실패:', error);
        setIsReferenceLoaded(true); // 실패해도 계속 진행
      }
    };

    preloadReference();
  }, []);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    setCurrentStep('result');
  };

  const handleReset = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setCurrentStep('upload');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 - 간단하게 */}
      <header className="text-center mb-8">
        <div className="text-5xl mb-2">🧘‍♀️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Like Buddha
        </h1>
        <p className="text-gray-500">
          부처는 모두의 마음 속에 있습니다.<br />
          일단 자세부터 따라해볼까요?
        </p>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="space-y-8">
        {currentStep === 'upload' && (
          <div className="text-center">
            {/* 기준 모델 - 간단하게 */}
            <div className="mb-8">
              <div className="relative w-48 h-64 mx-auto mb-4">
                <Image
                  src="/images/reference-model.jpg"
                  alt="금동미륵보살반가사유상"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                  priority
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  예시
                </div>
              </div>
              <p className="text-sm text-gray-600">
                국립중앙박물관 소장
              </p>
            </div>

            {/* 업로드 섹션 */}
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        )}

        {currentStep === 'analyzing' && uploadedImage && (
          <div className="text-center">
            <PoseAnalyzer 
              imageUrl={uploadedImage} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {currentStep === 'result' && analysisResult && (
          <div className="text-center">
            <ResultDisplay 
              result={analysisResult}
              originalImage={uploadedImage}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      {/* 푸터 - 최소화 */}
      <footer className="mt-12 text-center text-gray-400">
        <p className="text-xs">
          국립중앙박물관 소장 금동미륵보살반가사유상
        </p>
      </footer>
    </div>
  );
}
