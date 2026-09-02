// 수상 실적 — 항목을 추가하면 자동으로 표시됨
// 예: { year: '2025', title: '대한민국 전시 콘텐츠 대상', org: '주관 기관명' }
const AWARDS = [];

const Awards = () => {
  return (
    <section id="awards" className="awards">
      <div className="container">
        <h2 className="section-title">수상 실적</h2>
        {AWARDS.length === 0 ? (
          <p className="awards-empty">내용 준비 중입니다.</p>
        ) : (
          <ul className="awards-list">
            {AWARDS.map((award) => (
              <li key={`${award.year}-${award.title}`} className="award-item">
                <span className="award-year">{award.year}</span>
                <span className="award-title">{award.title}</span>
                <span className="award-org">{award.org}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Awards;
