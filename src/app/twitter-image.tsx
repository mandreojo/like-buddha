import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Like Buddha - 케이팝 데몬 헌터스 반가사유상 자세 따라하기'
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fed7aa 0%, #fef3c7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: 16,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Like Buddha
        </div>
        
        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: 28,
            color: '#374151',
            textAlign: 'center',
            marginBottom: 32,
            maxWidth: '700px',
            lineHeight: 1.2,
          }}
        >
          케이팝 데몬 헌터스 반가사유상 자세 따라하기
        </div>
        
        {/* 특징 설명 */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#dc2626',
              }}
            >
              AI 분석
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#6b7280',
              }}
            >
              자세 점수 측정
            </div>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#dc2626',
              }}
            >
              국보 제83호
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#6b7280',
              }}
            >
              금동미륵보살반가사유상
            </div>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#dc2626',
              }}
            >
              넷플릭스
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#6b7280',
              }}
            >
              케이팝 데몬 헌터스
            </div>
          </div>
        </div>
        
        {/* 하단 브랜딩 */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            fontSize: 16,
            color: '#9ca3af',
            fontWeight: '500',
          }}
        >
          like-buddha.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
