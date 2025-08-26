import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

// 동적으로 로드할 기준 포즈 (초기에는 null)
let dynamicReferencePose: { [key: string]: { x: number; y: number } } | null = null;
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

// 기준 이미지에서 키포인트를 동적으로 로드하고 캐싱
async function getReferencePose() {
  if (dynamicReferencePose) {
    return dynamicReferencePose;
  }

  try {
    const refImg = new Image();
    refImg.crossOrigin = 'anonymous'; // CORS 문제 방지
    refImg.src = '/images/reference-model.jpg'; // 기준 이미지 경로

    await new Promise((resolve, reject) => {
      refImg.onload = resolve;
      refImg.onerror = reject;
    });

    const resizedRefImg = resizeImage(refImg); // 기준 이미지도 리사이즈하여 일관성 유지
    const currentDetector = await getPoseDetector();
    const poses = await currentDetector.estimatePoses(resizedRefImg);

    if (poses.length === 0) {
      console.error("기준 이미지에서 사람이 감지되지 않았습니다.");
      throw new Error("기준 이미지에서 자세를 감지할 수 없습니다.");
    }

    dynamicReferencePose = normalizeKeypoints(poses[0].keypoints, resizedRefImg.width, resizedRefImg.height);
    console.log("기준 포즈 로드 완료:", dynamicReferencePose);
    return dynamicReferencePose;
  } catch (error) {
    console.error("기준 포즈 로드 실패:", error);
    throw error;
  }
}

// 반가사유 자세의 특징적인 요소들 분석
function analyzePoseCharacteristics(userPose: { [key: string]: { x: number; y: number } }, referencePose: { [key: string]: { x: number; y: number } }) {
  const characteristics = {
    // 1. 손이 뺨에 닿는지 (반가사유의 핵심)
    handOnCheek: 0,
    // 2. 다리가 교차되어 있는지 (반가사유 자세)
    crossedLegs: 0,
    // 3. 상체가 약간 기울어져 있는지 (사유하는 자세)
    tiltedPosture: 0,
    // 4. 팔이 자연스럽게 놓여있는지
    naturalArmPosition: 0,
    // 5. 전체적인 균형감
    overallBalance: 0
  };

  // 1. 손이 뺨에 닿는지 확인 (가장 중요한 요소)
  if (userPose.rightWrist && referencePose.rightWrist) {
    const distance = calculateDistance(userPose.rightWrist, referencePose.rightWrist);
    // 뺨 근처에 있으면 높은 점수
    if (distance < 0.1) {
      characteristics.handOnCheek = 100;
    } else if (distance < 0.2) {
      characteristics.handOnCheek = 80;
    } else if (distance < 0.3) {
      characteristics.handOnCheek = 60;
    } else {
      characteristics.handOnCheek = Math.max(0, 100 - (distance * 200));
    }
  }

  // 2. 다리 교차 상태 확인
  if (userPose.leftKnee && userPose.rightKnee && userPose.leftAnkle && userPose.rightAnkle) {
    const leftKneeDistance = calculateDistance(userPose.leftKnee, referencePose.leftKnee);
    const rightKneeDistance = calculateDistance(userPose.rightKnee, referencePose.rightKnee);
    const leftAnkleDistance = calculateDistance(userPose.leftAnkle, referencePose.leftAnkle);
    const rightAnkleDistance = calculateDistance(userPose.rightAnkle, referencePose.rightAnkle);
    
    const avgLegDistance = (leftKneeDistance + rightKneeDistance + leftAnkleDistance + rightAnkleDistance) / 4;
    characteristics.crossedLegs = Math.max(0, 100 - (avgLegDistance * 150));
  }

  // 3. 상체 기울기 확인 (어깨와 엉덩이의 상대적 위치)
  if (userPose.leftShoulder && userPose.rightShoulder && userPose.leftHip && userPose.rightHip) {
    const shoulderCenter = {
      x: (userPose.leftShoulder.x + userPose.rightShoulder.x) / 2,
      y: (userPose.leftShoulder.y + userPose.rightShoulder.y) / 2
    };
    const hipCenter = {
      x: (userPose.leftHip.x + userPose.rightHip.x) / 2,
      y: (userPose.leftHip.y + userPose.rightHip.y) / 2
    };
    
    // 상체가 약간 기울어져 있으면 높은 점수
    const tiltAngle = Math.abs(shoulderCenter.x - hipCenter.x);
    if (tiltAngle > 0.05 && tiltAngle < 0.15) {
      characteristics.tiltedPosture = 100;
    } else if (tiltAngle > 0.02 && tiltAngle < 0.2) {
      characteristics.tiltedPosture = 70;
    } else {
      characteristics.tiltedPosture = Math.max(0, 100 - (Math.abs(tiltAngle - 0.1) * 500));
    }
  }

  // 4. 팔 위치의 자연스러움
  if (userPose.leftElbow && userPose.rightElbow && userPose.leftShoulder && userPose.rightShoulder) {
    const leftArmDistance = calculateDistance(userPose.leftElbow, referencePose.leftElbow);
    const rightArmDistance = calculateDistance(userPose.rightElbow, referencePose.rightElbow);
    const avgArmDistance = (leftArmDistance + rightArmDistance) / 2;
    characteristics.naturalArmPosition = Math.max(0, 100 - (avgArmDistance * 150));
  }

  // 5. 전체적인 균형감 (모든 키포인트의 조화)
  let totalDistance = 0;
  let validKeypoints = 0;
  
  Object.keys(referencePose).forEach(key => {
    if (userPose[key]) {
      const distance = calculateDistance(referencePose[key as keyof typeof referencePose], userPose[key]);
      totalDistance += distance;
      validKeypoints++;
    }
  });
  
  if (validKeypoints > 0) {
    const avgDistance = totalDistance / validKeypoints;
    characteristics.overallBalance = Math.max(0, 100 - (avgDistance * 100));
  }

  return characteristics;
}

// 자세 유사도 계산 (설득력 있는 알고리즘)
async function calculatePoseSimilarity(userPose: { [key: string]: { x: number; y: number } }) {
  const REFERENCE_POSE = await getReferencePose(); // 동적으로 로드된 기준 포즈 사용
  if (!REFERENCE_POSE) throw new Error("Reference pose not loaded.");

  // 반가사유 자세의 특징적 요소들 분석
  const characteristics = analyzePoseCharacteristics(userPose, REFERENCE_POSE);
  
  // 가중치를 적용한 종합 점수 계산
  const weights = {
    handOnCheek: 0.35,      // 가장 중요한 요소 (35%)
    crossedLegs: 0.25,      // 다리 자세 (25%)
    tiltedPosture: 0.20,    // 상체 기울기 (20%)
    naturalArmPosition: 0.15, // 팔 위치 (15%)
    overallBalance: 0.05    // 전체 균형 (5%)
  };

  const totalScore = 
    characteristics.handOnCheek * weights.handOnCheek +
    characteristics.crossedLegs * weights.crossedLegs +
    characteristics.tiltedPosture * weights.tiltedPosture +
    characteristics.naturalArmPosition * weights.naturalArmPosition +
    characteristics.overallBalance * weights.overallBalance;

  return totalScore;
}

// 특정 자세 요소별 점수 계산 (설득력 있는 분석)
async function calculateDetailedScores(userPose: { [key: string]: { x: number; y: number } }) {
  const REFERENCE_POSE = await getReferencePose(); // 동적으로 로드된 기준 포즈 사용
  if (!REFERENCE_POSE) throw new Error("Reference pose not loaded.");

  const characteristics = analyzePoseCharacteristics(userPose, REFERENCE_POSE);

  return {
    legPosition: Math.round(characteristics.crossedLegs),
    armPosition: Math.round(characteristics.naturalArmPosition),
    handPosition: Math.round(characteristics.handOnCheek),
    bodyPosture: Math.round(characteristics.tiltedPosture),
    overallSimilarity: Math.round(characteristics.overallBalance)
  };
}

// 메인 분석 함수
export async function analyzePose(imageElement: HTMLImageElement) {
  try {
    const currentDetector = await getPoseDetector(); // 모델 로드
    const REFERENCE_POSE_DATA = await getReferencePose(); // 기준 포즈 로드

    const resizedImage = resizeImage(imageElement); // 사용자 이미지도 리사이즈

    // 이미지에서 자세 감지
    const poses = await currentDetector.estimatePoses(resizedImage);

    if (poses.length === 0) {
      throw new Error('사람이 감지되지 않았습니다.');
    }

    const pose = poses[0];
    const normalizedPose = normalizeKeypoints(pose.keypoints, resizedImage.width, resizedImage.height);

    // 전체 유사도 계산
    const overallSimilarity = await calculatePoseSimilarity(normalizedPose);

    // 세부 점수 계산
    const detailedScores = await calculateDetailedScores(normalizedPose);

    // 완벽한 매칭 체크 (같은 이미지를 올렸을 때 100점 보장)
    const isPerfectMatch = overallSimilarity >= 99.9; // 99.9점 이상이면 100점으로 간주

    return {
      score: isPerfectMatch ? 100 : Math.round(overallSimilarity),
      message: isPerfectMatch ? "완벽한 매칭! 🎯✨" : getMessageByScore(overallSimilarity),
      poseData: {
        keypoints: pose.keypoints,
        confidence: overallSimilarity / 100
      },
      comparisonDetails: {
        legPosition: detailedScores.legPosition,
        armPosition: detailedScores.armPosition,
        handPosition: detailedScores.handPosition,
        bodyPosture: detailedScores.bodyPosture,
        overallSimilarity: Math.round(overallSimilarity)
      }
    };

  } catch (error) {
    console.error('자세 분석 중 오류:', error);
    throw error;
  }
}

// 점수별 메시지 (더 구체적이고 설득력 있게)
function getMessageByScore(score: number): string {
  if (score >= 95) return "완벽한 반가사유 자세! 🎯✨"; // 100점은 isPerfectMatch에서 처리
  if (score >= 90) return "거의 완벽해요! 손이 뺨에 닿는 자세가 정말 좋아요! 🌟";
  if (score >= 80) return "매우 좋아요! 다리 교차와 상체 기울기가 자연스러워요! 🧘‍♂️";
  if (score >= 70) return "좋은 자세예요! 반가사유의 핵심 요소들이 잘 표현되었어요! 💪";
  if (score >= 60) return "괜찮아요! 손 위치를 조금 더 뺨 쪽으로 가져가보세요! 📚";
  if (score >= 50) return "조금 더 노력해요! 다리를 교차하고 상체를 기울여보세요! 🚶‍♀️";
  if (score >= 30) return "연습이 필요해요! 반가사유 자세의 기본을 다시 한번 확인해보세요! 🤔";
  if (score >= 10) return "사람이 감지되었지만 자세가 다르네요! 반가사유 자세를 참고해보세요! 😅";
  return "사람이 감지되지 않았어요! 📸";
}
