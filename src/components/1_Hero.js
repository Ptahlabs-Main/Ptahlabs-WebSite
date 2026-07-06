import LogoLineMotif from './LogoLineMotif';

const Hero = () => {
  return (
    <section className="hero">
      {/* 로고 라인 문양 배경 (벡터, 선 굵기 1px 고정) */}
      <LogoLineMotif className="hero-motif" />

      {/* 좌우 헤어라인 장식 */}
      <span className="hero-side-line hero-side-line-left" aria-hidden="true" />
      <span className="hero-side-line hero-side-line-right" aria-hidden="true" />

      {/* 콘텐츠 */}
      <div className="container hero-content">
        <h1 className="hero-title">PTAHLABS</h1>
        <p className="hero-subtitle">사람과 공간을 연결하며 새로운 경험을 창조하는 기술</p>
      </div>
    </section>
  );
};

export default Hero;
