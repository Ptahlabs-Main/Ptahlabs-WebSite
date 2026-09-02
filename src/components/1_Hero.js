import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import LogoLineMotif, { POLYGONS } from './LogoLineMotif';

// 대표 프로젝트 슬라이드 (항목을 추가하면 캐러셀에 자동 반영)
const HERO_SLIDES = [
  {
    id: '2025_Wonju_Sogeumsan',
    title: '소금산 미디어아트센터 · 나만의 정원',
    image: '/portfolio/2025_Wonju_Sogeumsan/Forest_Main.png',
  },
  {
    id: '2025_Wonju_ScienceMuseum',
    title: '원주 과학관',
    image: '/portfolio/2025_Wonju_ScienceMuseum/Title.jpg',
  },
  {
    id: '2025_Busan_Democracy',
    title: '부산 민주공원 민주주의기록관',
    image: '/portfolio/2025_Busan_Democracy/Main.jpg',
  },
];

// 휠/스와이프 한 번당 슬라이드 한 장 (연속 입력 방지 간격)
const WHEEL_COOLDOWN_MS = 900;

const Hero = () => {
  const [slide, setSlide] = useState(0);
  const brandRef = useRef(null);
  const lastMoveRef = useRef(0);
  const router = useRouter();
  const current = HERO_SLIDES[slide];

  // 스크롤(휠)·스와이프로 슬라이드 전환
  useEffect(() => {
    if (HERO_SLIDES.length < 2) return;

    const step = (dir) => {
      const now = Date.now();
      if (now - lastMoveRef.current < WHEEL_COOLDOWN_MS) return;
      lastMoveRef.current = now;
      setSlide((s) => (s + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 10) return; // 트랙패드 미세 입력 무시
      step(e.deltaY > 0 ? 1 : -1);
    };

    let touchY = null;
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (touchY === null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1);
      touchY = null;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const handleProjectClick = (e) => {
    e.preventDefault();
    router.push(`/project/${current.id}`);
  };

  return (
    <section className="hero">
      {/* 대표 프로젝트 이미지 슬라이드 배경 + 어두운 스크림 */}
      <div className="hero-bg" aria-hidden="true">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`hero-bg-slide ${i === slide ? 'visible' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}
        <div className="hero-scrim" />
      </div>

      {/* 중앙 로고: 젖빛 유리(백드롭 블러) 마크 + 텍스트 (스크롤하면 사라지고 실제 헤더가 나타남) */}
      <div className="hero-brand-row" ref={brandRef}>
        {/* 로고 다각형을 clip-path로 쓰기 위한 정의 (viewBox 55.13 x 54.5 → 0~1 정규화) */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id="hero-logo-clip" clipPathUnits="objectBoundingBox">
              {POLYGONS.map((p) => (
                <polygon
                  key={p.face}
                  points={p.points}
                  transform="scale(0.018139, 0.018349)"
                />
              ))}
            </clipPath>
          </defs>
        </svg>
        <span className="hero-brand-mark" aria-hidden="true">
          <span className="hero-frost" />
          <LogoLineMotif className="hero-motif-lines" />
        </span>
        <span className="hero-brand-title">PTAHLABS</span>
      </div>

      {/* 좌우 헤어라인 + 세로 라벨 */}
      <div className="hero-side hero-side-left">
        <span className="hero-side-label">MEDIA ART</span>
        <span className="hero-side-line" aria-hidden="true" />
      </div>
      <div className="hero-side hero-side-right">
        <span className="hero-side-line" aria-hidden="true" />
        <span className="hero-side-label">DIGITAL EXHIBITION</span>
        {HERO_SLIDES.length > 1 && (
          <div className="hero-dots" role="tablist" aria-label="대표 프로젝트 선택">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`hero-dot ${i === slide ? 'active' : ''}`}
                aria-label={s.title}
                aria-selected={i === slide}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단: 현재 슬라이드 프로젝트로 이동하는 버튼 */}
      <div className="hero-bottom">
        <a
          className="hero-cta"
          href={`/project/${current.id}`}
          onClick={handleProjectClick}
        >
          {current.title}
          <span className="hero-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>

    </section>
  );
};

export default Hero;
