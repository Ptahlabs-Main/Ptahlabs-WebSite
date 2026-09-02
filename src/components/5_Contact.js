const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <p className="contact-sub">프로젝트 의뢰 및 협업 문의</p>

        <div className="contact-layout">
          {/* 좌: 문의 가이드 */}
          <div className="contact-guide">
            <p className="contact-description">
              이메일로 문의 주시면 빠르게 답변드립니다.
              <br />
              아래 내용을 포함해주시면 더 정확한 상담이 가능합니다.
            </p>

            <ul className="contact-info-list">
              <li>
                <span className="contact-num">01</span>
                프로젝트 종류 (웹/앱/전시 콘텐츠 등)
              </li>
              <li>
                <span className="contact-num">02</span>
                예산 및 일정
              </li>
              <li>
                <span className="contact-num">03</span>
                간단한 프로젝트 설명
              </li>
            </ul>
          </div>

          {/* 우: 연락 채널 */}
          <div className="contact-channels">
            <div className="contact-channel">
              <span className="contact-label">EMAIL</span>
              <a className="contact-email" href="mailto:ptahlabs@naver.com">
                ptahlabs@naver.com
              </a>
            </div>
            <div className="contact-channel">
              <span className="contact-label">ADDRESS</span>
              <p className="contact-address">
                경기도 용인시 기흥구 강남동로 6
                <br />
                (그랜드프라자) 501-623호
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
