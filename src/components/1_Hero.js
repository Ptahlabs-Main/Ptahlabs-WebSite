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
  const slideRef = useRef(0);
  const router = useRouter();
  const current = HERO_SLIDES[slide];

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  // 히어로 상단에서 휠: 슬라이드를 한 장씩 넘기고, 마지막 장에서 아래 섹션으로 이어서 이동
  useEffect(() => {
    const onWheel = (e) => {
      if (window.scrollY > 8) return; // 히어로를 지나면 기본 스크롤에 맡김
      if (Math.abs(e.deltaY) < 10) return; // 트랙패드 미세 입력 무시

      const now = Date.now();
      if (now - lastMoveRef.current < WHEEL_COOLDOWN_MS) {
        e.preventDefault(); // 전환 애니메이션 중에는 스크롤 고정
        return;
      }

      const down = e.deltaY > 0;
      const s = slideRef.current;

      if (down && s < HERO_SLIDES.length - 1) {
        e.preventDefault();
        lastMoveRef.current = now;
        setSlide(s + 1);
      } else if (!down && s > 0) {
        e.preventDefault();
        lastMoveRef.current = now;
        setSlide(s - 1);
      } else if (down && s === HERO_SLIDES.length - 1) {
        // 마지막 슬라이드: 설치 실적 섹션으로 스크롤 전환
        e.preventDefault();
        lastMoveRef.current = now;
        const el = document.getElementById('locations');
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY;
        // 홈의 lerp 스크롤러가 있으면 그쪽으로, 없으면 기본 스무스 스크롤
        const handled = !window.dispatchEvent(
          new CustomEvent('ptah:lerp-scroll', { detail: { y }, cancelable: true })
        );
        if (!handled) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
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

      {/* 좌하단 스크롤 유도 */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue-line" />
        <span className="hero-scroll-cue-label">SCROLL</span>
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
