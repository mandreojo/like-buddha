'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { analyzePose } from '@/utils/poseAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

interface PoseAnalyzerProps {
  imageUrl: string;
  onAnalysisComplete: (result: {
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
  }) => void;
}

export default function PoseAnalyzer({ imageUrl, onAnalysisComplete }: PoseAnalyzerProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(t('loadingModel'));

  useEffect(() => {
    performAnalysis();
  }, [imageUrl]);

  const performAnalysis = async () => {
                    try {
                  setProgress(10);
                  setStatus(t('loadingModel'));
                  await new Promise(resolve => setTimeout(resolve, 500));

                  setProgress(30);
                  setStatus(t('analyzingImage'));
                  await new Promise(resolve => setTimeout(resolve, 500));

                  setProgress(60);
                  setStatus(t('comparingPose'));
      
      // 실제 이미지 분석 수행
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

            const result = await analyzePose(img);
      
      // 메시지 키도 함께 전달 (실시간 번역을 위해)
      const translatedResult = {
        ...result,
        message: t(result.messageKey || 'noPersonDetected'),
        messageKey: result.messageKey || 'noPersonDetected'
      };
      
      setProgress(100);
      setStatus(t('analysisComplete'));
      await new Promise(resolve => setTimeout(resolve, 300));

      onAnalysisComplete(translatedResult);

                    } catch (error) {
                  console.error('분석 중 오류:', error);
                  setStatus(t('imageGenerationFailed'));

                  // 오류 시에도 기본 결과 제공
                  const fallbackResult = {
                    score: 0,
                    message: t('noPersonDetected'),
        poseData: { keypoints: [], confidence: 0 },
        comparisonDetails: {
          legPosition: 0,
          armPosition: 0,
          handPosition: 0,
          bodyPosture: 0,
          overallSimilarity: 0
        }
      };
      
      setTimeout(() => onAnalysisComplete(fallbackResult), 1000);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <Loader2 className="w-full h-full text-orange-500 animate-spin" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('analyzing')}
            </h3>
            <p className="text-sm text-gray-600">
              {status}
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{status}</span>
            <span className="font-medium">{progress}%</span>
          </div>

          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt="분석 중인 이미지" 
              className="w-24 h-24 object-cover rounded-lg mx-auto opacity-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
