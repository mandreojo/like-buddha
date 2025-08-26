# 🧘‍♀️ Like Buddha

**부처님 자세 따라하기** - AI가 당신의 자세를 분석해드립니다!

## 📖 프로젝트 소개

'Like Buddha'는 사진을 업로드하면 AI가 부처님 자세와 얼마나 비슷한지 점수를 매겨주는 재미있는 웹 애플리케이션입니다. 

### 🎯 주요 기능
- 📸 **사진 업로드**: 드래그 앤 드롭으로 간편하게 사진 업로드
- 🤖 **AI 자세 분석**: TensorFlow.js를 활용한 자세 분석
- 📊 **점수 시스템**: 0-100점까지 부처님 자세 유사도 점수
- 🎨 **결과 이미지**: 점수와 함께 결과 이미지 생성
- 📱 **SNS 공유**: 트위터, 페이스북, 인스타그램 공유 기능

### 🎮 사용법
1. **사진 업로드**: 부처님 자세를 따라한 사진을 업로드
2. **AI 분석**: 자동으로 자세를 분석하고 점수 계산
3. **결과 확인**: 점수와 함께 재미있는 메시지 확인
4. **공유하기**: SNS에 결과를 공유하고 친구들과 경쟁!

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI/ML**: TensorFlow.js, Pose Detection
- **UI/UX**: Lucide React Icons, React Dropzone
- **Deployment**: Vercel (예정)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/like-buddha.git
cd like-buddha

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요!

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
like-buddha/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 메인 레이아웃
│   │   ├── page.tsx            # 홈페이지
│   │   └── globals.css         # 전역 스타일
│   └── components/
│       ├── ImageUploader.tsx   # 이미지 업로드 컴포넌트
│       ├── PoseAnalyzer.tsx    # 자세 분석 컴포넌트
│       └── ResultDisplay.tsx   # 결과 표시 컴포넌트
├── docs/
│   └── project-plan.html       # 프로젝트 기획서
└── public/                     # 정적 파일들
```

## 🎨 점수 시스템

| 점수 | 등급 | 메시지 |
|------|------|--------|
| 90-100 | 🧘‍♀️✨ | 해탈의 경지에 오르셨습니다! |
| 80-89 | 🌟 | 거의 깨달음에 가까우십니다! |
| 70-79 | 🧘‍♂️ | 선정에 빠져들고 계십니다! |
| 60-69 | 💪 | 좋은 자세입니다! 조금만 더 노력하세요! |
| 50-59 | 📚 | 기본은 갖추셨습니다! 연습이 필요해요! |
| 30-49 | 🚶‍♀️ | 아직 갈 길이 멀지만, 포기하지 마세요! |
| 0-29 | 🌱 | 처음부터 차근차근 연습해보세요! |

## 📸 좋은 사진을 위한 팁

- **전체 몸이 보이도록** 촬영하세요
- **밝은 곳**에서 촬영하세요
- **부처님 자세(연꽃 자세)**를 취해보세요
- **배경이 깔끔한** 곳에서 촬영하세요

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- **부처님**: 영감을 주신 부처님께 감사드립니다
- **TensorFlow.js**: 자세 분석 기술 제공
- **Next.js**: 훌륭한 React 프레임워크
- **Tailwind CSS**: 아름다운 UI 구현

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요!

---

**"정법을 보고 생사문이 어제 나오게 되었습니다!"** - 부처님 🧘‍♀️
