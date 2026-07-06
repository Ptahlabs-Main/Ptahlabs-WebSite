import Head from 'next/head'

// Hero 디자인 시안 비교용 임시 페이지 (시안 확정 후 삭제)
// http://localhost:3000/hero-drafts
export default function HeroDrafts() {
  return (
    <>
      <Head>
        <title>Hero 시안 비교 - PTAHLABS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="hd">
        {/* 안내 */}
        <div className="hd-intro">
          <p>아래로 스크롤하며 4개 시안을 비교하세요. 마음에 드는 번호를 알려주시면 실제 Hero에 적용합니다.</p>
        </div>

        {/* ───────── 시안 1: 오버사이즈 크롭 워드마크 (Glossier식) ───────── */}
        <section className="hd-sec hd-1">
          <span className="hd-badge">시안 1 — 오버사이즈 크롭</span>
          <div className="hd-1-top">
            <p className="hd-1-label">MEDIA ART &amp; DIGITAL EXHIBITION</p>
            <p className="hd-1-desc">사람과 공간을 연결하며<br />새로운 경험을 창조하는 기술</p>
          </div>
          <h1 className="hd-1-wordmark">PTAHLABS</h1>
        </section>

        {/* ───────── 시안 2: 그리드 랩 (ChainGPT Labs식) ───────── */}
        <section className="hd-sec hd-2">
          <span className="hd-badge">시안 2 — 그리드 랩</span>
          <div className="hd-2-grid">
            <div className="hd-2-row hd-2-row-top">
              <div className="hd-2-cell"><span className="hd-2-sq" /> MEDIA ART</div>
              <div className="hd-2-cell">DIGITAL EXHIBITION</div>
              <div className="hd-2-cell hd-2-right">SINCE 2025 <span className="hd-2-sq" /></div>
            </div>
            <h1 className="hd-2-title">PTAHLABS</h1>
            <div className="hd-2-row hd-2-row-bottom">
              <div className="hd-2-cell hd-2-desc">
                사람과 공간을 연결하며 새로운 경험을 창조하는 기술.
                인터랙티브 전시 콘텐츠를 만듭니다.
              </div>
              <div className="hd-2-cell" />
              <div className="hd-2-cell hd-2-right"><span className="hd-2-btn">포트폴리오 ↓</span></div>
            </div>
          </div>
        </section>

        {/* ───────── 시안 3: 컬러 블록 스택 (Outline식) ───────── */}
        <section className="hd-sec hd-3">
          <span className="hd-badge">시안 3 — 컬러 블록 스택</span>
          <p className="hd-3-logo">PTAHLABS</p>
          <div className="hd-3-stack">
            <div className="hd-3-bar hd-3-bar-a">MEDIA ART</div>
            <div className="hd-3-bar hd-3-bar-b">INTERACTIVE</div>
            <div className="hd-3-bar hd-3-bar-c">EXHIBITION</div>
          </div>
          <p className="hd-3-sub">사람과 공간을 연결하며 새로운 경험을 창조하는 기술</p>
        </section>

        {/* ───────── 시안 4: 라인 드로잉 + 와이드 트래킹 (설계도식) ───────── */}
        <section className="hd-sec hd-4">
          <span className="hd-badge">시안 4 — 설계도 라인 드로잉</span>
          <img className="hd-4-motif" src="/images/logo/4x/SignLine@4x.png" alt="" aria-hidden="true" />
          <div className="hd-4-content">
            <h1 className="hd-4-title">PTAHLABS</h1>
            <p className="hd-4-sub">사람과 공간을 연결하며 새로운 경험을 창조하는 기술</p>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .hd { background: #faf9f6; }
        .hd-intro {
          padding: 16px 24px;
          font-size: 0.9rem;
          color: #666;
          border-bottom: 1px solid #e5e2da;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .hd-intro p { margin: 0; }
        .hd-sec {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          border-bottom: 4px solid #2c2c2c;
        }
        .hd-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 50;
          background: #2c2c2c;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 6px;
        }

        /* ── 시안 1: 오버사이즈 크롭 ── */
        .hd-1 { background: #faf9f6; }
        .hd-1-top {
          padding: 130px 5vw 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          flex-wrap: wrap;
        }
        .hd-1-label {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #7a845c;
        }
        .hd-1-desc {
          font-size: 1.15rem;
          line-height: 1.7;
          color: #2c2c2c;
          text-align: right;
        }
        .hd-1-wordmark {
          position: absolute;
          bottom: -0.23em;
          left: 0;
          width: 100%;
          margin: 0;
          font-size: 17.5vw;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 1;
          color: #28391a;
          white-space: nowrap;
          text-align: center;
        }

        /* ── 시안 2: 그리드 랩 ── */
        .hd-2 { background: #f1f1ec; display: flex; align-items: center; }
        .hd-2-grid {
          width: 100%;
          border-top: 1px solid #cfcfc5;
          border-bottom: 1px solid #cfcfc5;
        }
        .hd-2-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        }
        .hd-2-row-top { border-bottom: 1px solid #cfcfc5; }
        .hd-2-row-bottom { border-top: 1px solid #cfcfc5; }
        .hd-2-cell {
          padding: 20px 24px;
          font-family: 'Consolas', 'SFMono-Regular', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          color: #2c2c2c;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hd-2-cell + .hd-2-cell { border-left: 1px solid #cfcfc5; }
        .hd-2-right { justify-content: flex-end; }
        .hd-2-sq { width: 9px; height: 9px; background: #7a845c; display: inline-block; }
        .hd-2-title {
          margin: 0;
          padding: 2vw 0;
          font-size: 14.5vw;
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: #28391a;
          white-space: nowrap;
          text-align: center;
          margin-left: -1.5vw;
          margin-right: -1.5vw;
        }
        .hd-2-desc {
          font-family: inherit;
          letter-spacing: 0;
          font-size: 0.95rem;
          line-height: 1.7;
          word-break: keep-all;
        }
        .hd-2-btn {
          background: #7a845c;
          color: #faf9f6;
          padding: 12px 22px;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
        }

        /* ── 시안 3: 컬러 블록 스택 ── */
        .hd-3 {
          background: #faf9f6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          text-align: center;
          padding: 80px 20px;
        }
        .hd-3-logo {
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 0.35em;
          color: #28391a;
          margin-right: -0.35em;
        }
        .hd-3-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: min(760px, 92vw);
        }
        .hd-3-bar {
          font-size: clamp(2.2rem, 7vw, 4.6rem);
          font-weight: 900;
          letter-spacing: 0.02em;
          line-height: 1.15;
          padding: 8px 20px;
        }
        .hd-3-bar-a { background: #28391a; color: #faf9f6; }
        .hd-3-bar-b { background: #7a845c; color: #faf9f6; transform: translateX(4%); }
        .hd-3-bar-c { background: #faf9f6; color: #28391a; border: 3px solid #28391a; transform: translateX(-3%); }
        .hd-3-sub { font-size: 1.05rem; color: #55584c; }

        /* ── 시안 4: 설계도 라인 드로잉 ── */
        .hd-4 {
          background: #f7f5ee;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hd-4-motif {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(70vw, 520px);
          opacity: 0.12;
        }
        .hd-4-content { position: relative; text-align: center; }
        .hd-4-title {
          margin: 0 0 1.6rem;
          font-size: clamp(1.8rem, 6vw, 4.2rem);
          font-weight: 300;
          letter-spacing: 0.42em;
          margin-right: -0.42em;
          color: #4c503f;
        }
        .hd-4-sub {
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          color: #8a8a80;
        }

        @media (max-width: 640px) {
          .hd-2-row { grid-template-columns: 1fr; }
          .hd-2-cell + .hd-2-cell { border-left: none; border-top: 1px solid #cfcfc5; }
          .hd-1-desc { text-align: left; }
        }
      `}</style>
    </>
  )
}
