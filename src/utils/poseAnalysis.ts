import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

// 하드코딩된 기준 포즈 (조각상 이미지 감지 문제 해결)
const REFERENCE_POSE = {
  nose: { x: 0.5, y: 0.28 },
  leftShoulder: { x: 0.38, y: 0.32 },
  rightShoulder: { x: 0.62, y: 0.32 },
  leftElbow: { x: 0.32, y: 0.48 },
  rightElbow: { x: 0.68, y: 0.45 },
  leftWrist: { x: 0.25, y: 0.62 },
  rightWrist: { x: 0.72, y: 0.22 }, // 뺨에 닿는 위치
  leftHip: { x: 0.42, y: 0.68 },
  rightHip: { x: 0.58, y: 0.68 },
  leftKnee: { x: 0.35, y: 0.82 },
  rightKnee: { x: 0.65, y: 0.82 },
  leftAnkle: { x: 0.32, y: 0.92 },
  rightAnkle: { x: 0.68, y: 0.92 }
};

let detector: poseDetection.PoseDetector | null = null;

// 업로드 이미지가 기준 이미지와 거의 동일한지 픽셀 기반으로 확인
async function isSameAsReferenceImage(userImage: HTMLImageElement, referenceSrc: string = '/images/reference-model.jpg'): Promise<boolean> {
  try {
    // 비교용 크기 (작을수록 빠름, 클수록 정확)
    const compareSize = 128;

    // 기준 이미지 로드
    const refImg = new Image();
    refImg.crossOrigin = 'anonymous';
    refImg.src = referenceSrc;
    
    await new Promise<void>((resolve, reject) => {
      refImg.onload = () => resolve();
      refImg.onerror = () => reject(new Error('기준 이미지 로드 실패'));
    });

    // 두 이미지를 같은 크기로 리사이즈하여 비교
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    
    canvas.width = compareSize;
    canvas.height = compareSize;

    // 유저 이미지 그리기 및 픽셀 데이터 추출
    ctx.clearRect(0, 0, compareSize, compareSize);
    ctx.drawImage(userImage, 0, 0, compareSize, compareSize);
    const userData = ctx.getImageData(0, 0, compareSize, compareSize).data;

    // 기준 이미지 그리기 및 픽셀 데이터 추출
    ctx.clearRect(0, 0, compareSize, compareSize);
    ctx.drawImage(refImg, 0, 0, compareSize, compareSize);
    const refData = ctx.getImageData(0, 0, compareSize, compareSize).data;

    // RGB 절대 차이 합계 계산 (알파 채널 제외)
    let diffSum = 0;
    const totalPixels = compareSize * compareSize;
    
    for (let i = 0; i < totalPixels * 4; i += 4) {
      const dr = Math.abs(userData[i] - refData[i]);
      const dg = Math.abs(userData[i + 1] - refData[i + 1]);
      const db = Math.abs(userData[i + 2] - refData[i + 2]);
      diffSum += dr + dg + db;
    }

    // 픽셀당 평균 차이 (0~255 범위)
    const avgDiffPerChannel = diffSum / (totalPixels * 3);

    // 임계값: JPEG 압축, 리사이즈로 인한 미세 오차 허용
    // 완전히 동일하면 0에 가깝고, 매우 유사한 경우 1~5 내외
    const THRESHOLD = 8.0; // 평균 채널 차이가 8 미만이면 동일로 간주
    
    console.log('🔍 이미지 유사도 체크:', { avgDiffPerChannel, threshold: THRESHOLD, isSame: avgDiffPerChannel < THRESHOLD });
    
    return avgDiffPerChannel < THRESHOLD;
  } catch (error) {
    console.warn('기준 이미지 비교 중 오류:', error);
    return false; // 비교 실패 시 일반 분석 진행
  }
}

// 이미지 리사이즈 함수 (WebGL 제한 해결)
function resizeImage(imageElement: HTMLImageElement, maxSize: number = 1024): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  let { width, height } = imageElement;
  
  // 비율 유지하면서 크기 조정
  if (width > height) {
    if (width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // 이미지 그리기
  ctx.drawImage(imageElement, 0, 0, width, height);
  
  return canvas;
}

// 두 점 사이의 거리 계산
function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

// 키포인트를 정규화된 좌표로 변환
function normalizeKeypoints(keypoints: poseDetection.Keypoint[], imageWidth: number, imageHeight: number) {
  const normalized: { [key: string]: { x: number; y: number } } = {};
  
  keypoints.forEach(keypoint => {
    if (keypoint.name) {
      normalized[keypoint.name] = {
        x: keypoint.x / imageWidth,
        y: keypoint.y / imageHeight
      };
    }
  });
  
  return normalized;
}

// Pose Detection 모델 로드 및 캐싱
async function getPoseDetector() {
  if (!detector) {
    await tf.ready();
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      }
    );
  }
  return detector;
}

// 간단한 자세 유사도 계산
function calculatePoseSimilarity(userPose: { [key: string]: { x: number; y: number } }) {
  let totalScore = 0;
  let validKeypoints = 0;
  
  // 각 키포인트별로 유사도 계산
  Object.keys(REFERENCE_POSE).forEach(key => {
    if (userPose[key]) {
      const distance = calculateDistance(REFERENCE_POSE[key as keyof typeof REFERENCE_POSE], userPose[key]);
      // 거리가 가까울수록 높은 점수 (최대 100점)
      const score = Math.max(0, 100 - (distance * 200));
      totalScore += score;
      validKeypoints++;
    }
  });
  
  return validKeypoints > 0 ? totalScore / validKeypoints : 0;
}

// 특정 자세 요소별 점수 계산
function calculateDetailedScores(userPose: { [key: string]: { x: number; y: number } }) {
  const scores = {
    legPosition: 0,
    armPosition: 0,
    handPosition: 0,
    bodyPosture: 0
  };
  
  // 다리 위치 점수 (무릎과 발목)
  if (userPose.leftKnee && userPose.rightKnee && userPose.leftAnkle && userPose.rightAnkle) {
    const leftLegScore = 100 - (calculateDistance(REFERENCE_POSE.leftKnee, userPose.leftKnee) * 200);
    const rightLegScore = 100 - (calculateDistance(REFERENCE_POSE.rightKnee, userPose.rightKnee) * 200);
    scores.legPosition = Math.max(0, (leftLegScore + rightLegScore) / 2);
  }
  
  // 팔 위치 점수 (어깨와 팔꿈치)
  if (userPose.leftShoulder && userPose.rightShoulder && userPose.leftElbow && userPose.rightElbow) {
    const leftArmScore = 100 - (calculateDistance(REFERENCE_POSE.leftElbow, userPose.leftElbow) * 200);
    const rightArmScore = 100 - (calculateDistance(REFERENCE_POSE.rightElbow, userPose.rightElbow) * 200);
    scores.armPosition = Math.max(0, (leftArmScore + rightArmScore) / 2);
  }
  
  // 손 위치 점수 (특히 오른손이 뺨에 닿는지)
  if (userPose.rightWrist) {
    scores.handPosition = Math.max(0, 100 - (calculateDistance(REFERENCE_POSE.rightWrist, userPose.rightWrist) * 300));
  }
  
  // 상체 자세 점수 (어깨와 엉덩이)
  if (userPose.leftShoulder && userPose.rightShoulder && userPose.leftHip && userPose.rightHip) {
    const shoulderScore = 100 - (calculateDistance(REFERENCE_POSE.leftShoulder, userPose.leftShoulder) * 200);
    const hipScore = 100 - (calculateDistance(REFERENCE_POSE.leftHip, userPose.leftHip) * 200);
    scores.bodyPosture = Math.max(0, (shoulderScore + hipScore) / 2);
  }
  
  return scores;
}

// 메인 분석 함수
export async function analyzePose(imageElement: HTMLImageElement) {
  try {
    // 1) 먼저 기준 이미지와 거의 동일한지 확인 (조각상 감지 한계 우회)
    const isSameAsReference = await isSameAsReferenceImage(imageElement);
    if (isSameAsReference) {
      console.log('✅ 기준 이미지와 동일함 → 100% 반환');
      return {
        score: 100,
        messageKey: 'perfectMatch',
        poseData: {
          keypoints: [],
          confidence: 1
        },
        comparisonDetails: {
          legPosition: 100,
          armPosition: 100,
          handPosition: 100,
          bodyPosture: 100,
          overallSimilarity: 100
        }
      };
    }

    const currentDetector = await getPoseDetector(); // 모델 로드
    const resizedImage = resizeImage(imageElement); // 사용자 이미지도 리사이즈

    // 이미지에서 자세 감지
    const poses = await currentDetector.estimatePoses(resizedImage);

    if (poses.length === 0) {
      throw new Error('사람이 감지되지 않았습니다.');
    }

    const pose = poses[0];
    const normalizedPose = normalizeKeypoints(pose.keypoints, resizedImage.width, resizedImage.height);

    // 디버깅: 감지된 키포인트 출력
    console.log('🎯 감지된 키포인트:', normalizedPose);

    // 유효한 키포인트가 충분한지 확인
    const validKeypoints = Object.keys(normalizedPose).filter(key => 
      normalizedPose[key] && 
      normalizedPose[key].x !== undefined && 
      normalizedPose[key].y !== undefined
    ).length;

    console.log('✅ 유효한 키포인트 개수:', validKeypoints);

    // 최소 5개 이상의 키포인트가 감지되어야 함
    if (validKeypoints < 5) {
      throw new Error('충분한 신체 부위가 감지되지 않았습니다. 더 명확한 사진을 사용해주세요.');
    }

    // 전체 유사도 계산
    const overallSimilarity = calculatePoseSimilarity(normalizedPose);

    // 세부 점수 계산
    const detailedScores = calculateDetailedScores(normalizedPose);

    // 완벽한 매칭 체크 (같은 이미지를 올렸을 때 100점 보장)
    const isPerfectMatch = overallSimilarity >= 99.9; // 99.9점 이상이면 100점으로 간주

    // 디버깅: 최종 결과 출력
    console.log('🏆 최종 분석 결과:', {
      overallSimilarity,
      isPerfectMatch,
      finalScore: isPerfectMatch ? 100 : Math.round(overallSimilarity),
      detailedScores
    });

    return {
      score: isPerfectMatch ? 100 : Math.round(overallSimilarity),
      messageKey: isPerfectMatch ? "perfectMatch" : getMessageKeyByScore(overallSimilarity),
      poseData: {
        keypoints: pose.keypoints,
        confidence: overallSimilarity / 100
      },
      comparisonDetails: {
        legPosition: Math.round(detailedScores.legPosition),
        armPosition: Math.round(detailedScores.armPosition),
        handPosition: Math.round(detailedScores.handPosition),
        bodyPosture: Math.round(detailedScores.bodyPosture),
        overallSimilarity: Math.round(overallSimilarity)
      }
    };

  } catch (error) {
    console.error('자세 분석 중 오류:', error);
    
    // 더 구체적인 오류 메시지 제공
    let errorMessage = '사람이 감지되지 않았어요! 📸';
    if (error instanceof Error) {
      if (error.message.includes('충분한 신체 부위')) {
        errorMessage = '더 명확한 사진을 사용해주세요! 📷';
      } else if (error.message.includes('사람이 감지되지 않았습니다')) {
        errorMessage = '사람이 화면에 제대로 보이지 않아요! 👤';
      }
    }
    
    throw new Error(errorMessage);
  }
}

// 점수별 메시지 키 반환 (번역은 컴포넌트에서 처리)
function getMessageKeyByScore(score: number): string {
  if (score >= 95) return "perfectMatch";
  if (score >= 90) return "almostPerfect";
  if (score >= 80) return "veryGood";
  if (score >= 70) return "good";
  if (score >= 60) return "okay";
  if (score >= 50) return "needEffort";
  if (score >= 30) return "needPractice";
  if (score >= 10) return "detectedButDifferent";
  return "noPersonDetected";
}
