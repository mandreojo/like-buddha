'use client';

import { useState } from 'react';
import { Upload, Camera, Sparkles, Share2, Trophy, Target } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import PoseAnalyzer from '@/components/PoseAnalyzer';
import ResultDisplay from '@/components/ResultDisplay';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
                const [analysisResult, setAnalysisResult] = useState<{
                score: number;
                message: string;
                messageKey?: string;
                poseData: any;
                comparisonDetails: {
                  legPosition: number;
                  armPosition: number;
                  handPosition: number;
                  bodyPosture: number;
                  overallSimilarity: number;
                };
              } | null>(null);

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
      {/* 언어 선택기 */}
      <div className="flex justify-end mb-4">
        <LanguageSelector />
      </div>

      {/* 헤더 - 간단하게 */}
      <header className="text-center mb-8">
        <div className="text-5xl mb-2">🧘‍♀️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-500 whitespace-pre-line">
          {t('subtitle')}
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
                  {t('example')}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {t('reference')}
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
                  <p className="text-xs mb-2">
                    {t('creator')}
                  </p>
                  <p className="text-xs">
                    <a 
                      href="https://open.kakao.com/o/gloUidHh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      [의견, 아이디어 제보 오픈카톡]
                    </a>
                  </p>
                </footer>
    </div>
  );
}
