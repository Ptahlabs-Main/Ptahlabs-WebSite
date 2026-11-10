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

// 로고 마크 마우스 반응 (숫자로 세기 조절)
const MAX_TILT_DEG = 18; // 마우스가 화면 반대편 끝에 있을 때의 최대 기울기
const TILT_EASE = 0.1; // 따라오는 속도 (작을수록 묵직)

// 로고 면(viewBox 55.13 x 54.5)을 % 좌표의 CSS clip-path로 변환 → 면마다 따로 된 유리 조각
const LOGO_W = 55.13;
const LOGO_H = 54.5;
const FACE_CLIPS = POLYGONS.map((p) => {
  const n = p.points.trim().split(/\s+/).map(Number);
  const pairs = [];
  for (let i = 0; i < n.length; i += 2) {
    pairs.push(`${((n[i] / LOGO_W) * 100).toFixed(3)}% ${((n[i + 1] / LOGO_H) * 100).toFixed(3)}%`);
  }
  return { face: p.face, clipPath: `polygon(${pairs.join(', ')})` };
});

const clampUnit = (v) => Math.max(-1, Math.min(1, v));

const Hero = () => {
  const [slide, setSlide] = useState(0);
  const brandRef = useRef(null);
  const markRef = useRef(null);
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

  // 로고 마크 마우스 반응: ① 마우스 방향으로 기울기 + 반사광 ② 마우스가 올라간 면만 블러가 풀림
  // (마우스가 있는 기기에서만 동작, 터치 기기는 정적 로고 그대로)
  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let goalX = 0;
    let goalY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;
    let clearFace = null;

    // 목표 각도까지 부드럽게 따라가고, 도착하면 루프를 멈춘다
    const render = () => {
      curX += (goalX - curX) * TILT_EASE;
      curY += (goalY - curY) * TILT_EASE;
      mark.style.setProperty('--tilt-y', `${(curX * MAX_TILT_DEG).toFixed(2)}deg`);
      mark.style.setProperty('--tilt-x', `${(-curY * MAX_TILT_DEG).toFixed(2)}deg`);
      const settled = Math.abs(goalX - curX) < 0.002 && Math.abs(goalY - curY) < 0.002;
      rafId = settled ? 0 : requestAnimationFrame(render);
    };
    const kick = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const setClearFace = (face) => {
      if (face === clearFace) return;
      if (clearFace) clearFace.classList.remove('is-clear');
      if (face) face.classList.add('is-clear');
      clearFace = face;
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const r = mark.getBoundingClientRect();
      if (r.bottom < 0) return; // 히어로를 지나 스크롤된 상태

      goalX = clampUnit((e.clientX - (r.left + r.width / 2)) / window.innerWidth);
      goalY = clampUnit((e.clientY - (r.top + r.height / 2)) / window.innerHeight);
      mark.style.setProperty('--glare-x', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      mark.style.setProperty('--glare-y', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);

      // 면 판정은 :hover 대신 좌표로 한다 — 상단에서 오버레이 헤더가 로고 위를 덮어도 동작하도록
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      const face = inside
        ? document
            .elementsFromPoint(e.clientX, e.clientY)
            .find((el) => el.classList.contains('hero-frost-face'))
        : null;
      setClearFace(face || null);
      kick();
    };

    const onLeave = () => {
      goalX = 0;
      goalY = 0;
      setClearFace(null);
      kick();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      setClearFace(null);
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

      {/* 중앙 로고: 유백색 유리(백드롭 블러) 마크 + 텍스트 (스크롤하면 사라지고 실제 헤더가 나타남) */}
      <div className="hero-brand-row" ref={brandRef}>
        <span className="hero-brand-mark" ref={markRef} aria-hidden="true">
          {/* 면마다 따로 된 유리 조각 (마우스가 올라간 조각만 맑아짐) */}
          {FACE_CLIPS.map((f) => (
            <span
              key={f.face}
              className="hero-frost-face"
              data-face={f.face}
              style={{ clipPath: f.clipPath }}
            />
          ))}
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
