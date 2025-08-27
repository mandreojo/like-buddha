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
      message: isPerfectMatch ? "완벽한 매칭! 🎯✨" : getMessageByScore(overallSimilarity),
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

// 점수별 메시지
function getMessageByScore(score: number): string {
  if (score >= 95) return "완벽한 반가사유 자세! 🎯✨";
  if (score >= 90) return "거의 완벽해요! 손이 뺨에 닿는 자세가 정말 좋아요! 🌟";
  if (score >= 80) return "매우 좋아요! 다리 교차와 상체 기울기가 자연스러워요! 🧘‍♂️";
  if (score >= 70) return "좋은 자세예요! 반가사유의 핵심 요소들이 잘 표현되었어요! 💪";
  if (score >= 60) return "괜찮아요! 손 위치를 조금 더 뺨 쪽으로 가져가보세요! 📚";
  if (score >= 50) return "조금 더 노력해요! 다리를 교차하고 상체를 기울여보세요! 🚶‍♀️";
  if (score >= 30) return "연습이 필요해요! 반가사유 자세의 기본을 다시 한번 확인해보세요! 🤔";
  if (score >= 10) return "사람이 감지되었지만 자세가 다르네요! 반가사유 자세를 참고해보세요! 😅";
  return "사람이 감지되지 않았어요! 📸";
}
