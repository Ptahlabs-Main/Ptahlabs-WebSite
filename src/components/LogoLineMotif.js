// PTAHLABS 로고 라인 문양 (벡터, 배경 장식용 단순화 버전)
// - 원본 PNG(Line@4x.png) 픽셀 분석으로 좌표 추출 후 접점 스냅
// - 원본의 "두께 표현" 이중선(림 안쪽 선, 패널 쌍 세로선, 캡)은 1px 극세선에서
//   이중선으로 보여 배경 용도에 맞게 제거 — 실루엣과 구조는 동일
// - stroke는 currentColor를 따르고, vector-effect로 확대해도 선 굵기가 유지됨
// - <g data-faces>: 면 단위 닫힌 폴리곤 (향후 마스크/클립으로 내부에 미디어를 채울 때 사용)
const LogoLineMotif = ({ className, showFaces = false }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 506 504"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* ── 면 (기본 비표시, 마스크/클립용) ── */}
      {showFaces && (
        <g data-faces fill="currentColor" stroke="none" opacity="0.06">
          <path data-face="left-wall" d="M2 164 L252 308 L252 501 L2 357 Z" />
          <path data-face="right-wall" d="M267 8 L504 145 L504 356 L267 219 Z" />
        </g>
      )}

      {/* ── 왼쪽 벽 (외곽 실루엣 + 상단 모서리) ── */}
      <path d="M250 3 L2 147 L2 357 L252 501 L252 308" />
      <path d="M2 164 L252 308" />

      {/* ── 오른쪽 벽 ── */}
      <path d="M267 8 L504 145 L504 356 L400 416" />
      <path d="M267 8 L267 172" />

      {/* ── 상단 슬릿 (브래킷 왼쪽 끝 수직 모서리) ── */}
      <path d="M250 3 L250 109" />
      <path d="M250 122 L250 168" />

      {/* ── 브래킷 1 (꺾인 패널) ── */}
      <path d="M250 109 L115 184 L304 293 L304 472" />

      {/* ── 브래킷 2 ── */}
      <path d="M250 168 L198 196 L342 278 L342 450" />

      {/* ── 패널 3 (직선) ── */}
      <path d="M267 172 L400 246 L400 416" />

      {/* ── 바닥 연결선 ── */}
      <path d="M252 501 L304 472" />
      <path d="M304 472 L342 450" />
      <path d="M342 450 L400 416" />
    </svg>
  );
};

export default LogoLineMotif;
