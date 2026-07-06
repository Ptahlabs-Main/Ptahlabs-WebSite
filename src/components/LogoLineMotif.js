// PTAHLABS 로고 마크 (디자이너 원본 벡터: public/images/logo/LogoAsset.svg 에서 마크 부분 추출)
// - 원본은 면(fill) 5조각으로 구성 → 여기서는 아웃라인(stroke)으로 렌더링
// - stroke는 currentColor를 따르고, vector-effect로 확대해도 선 굵기가 유지됨
// - showFaces: 원본 그대로 면을 채워서 렌더링 (향후 마스크/클립으로 내부에 미디어를 채울 때 사용)
const POLYGONS = [
  { face: 'panel-1', points: '34.89 30.78 34.89 50.18 37.24 48.82 37.24 30.02 21.85 21.13 27.42 17.91 27.42 13.13 15.98 19.87 34.89 30.78' },
  { face: 'panel-2', points: '25.08 21.13 38.86 29.09 38.86 47.88 42.03 46.05 42.03 27.54 28 19.44 25.08 21.13' },
  { face: 'back-wall', points: '29.13 32.6 29.13 53.5 33.27 51.11 33.27 31.72 12.76 19.88 27.42 11.25 27.42 0 .05 15.8 .05 15.81 29.13 32.6' },
  { face: 'right-wall', points: '29.04 .84 29.04 10.3 29.04 12.18 29.04 18.17 29.04 18.18 43.65 26.61 43.65 45.12 54.97 38.58 54.97 15.8 29.04 .84' },
  { face: 'left-wall', points: '27.51 33.53 .05 17.68 .05 38.58 27.51 54.44 27.51 33.53' },
];

const LogoLineMotif = ({ className, showFaces = false }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 55.13 54.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {showFaces ? (
        <g data-faces fill="currentColor" stroke="none">
          {POLYGONS.map((p) => (
            <polygon key={p.face} data-face={p.face} points={p.points} />
          ))}
        </g>
      ) : (
        POLYGONS.map((p) => (
          <polygon key={p.face} data-face={p.face} points={p.points} />
        ))
      )}
    </svg>
  );
};

export default LogoLineMotif;
