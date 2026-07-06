import LogoLineMotif from './LogoLineMotif';

const Hero = () => {
  return (
    <section className="hero">
      {/* 로고 라인 문양 배경 (벡터, 선 굵기 1px 고정) */}
      <LogoLineMotif className="hero-motif" />

      {/* 좌우 헤어라인 + 세로 라벨 */}
      <div className="hero-side hero-side-left">
        <span className="hero-side-label">MEDIA ART</span>
        <span className="hero-side-line" aria-hidden="true" />
      </div>
      <div className="hero-side hero-side-right">
        <span className="hero-side-line" aria-hidden="true" />
        <span className="hero-side-label">DIGITAL EXHIBITION</span>
      </div>

      {/* 콘텐츠 */}
      <div className="container hero-content">
        <h1 className="hero-title">PTAHLABS</h1>
      </div>
    </section>
  );
};

export default Hero;
