import LogoGlass3D from './lab/LogoGlass3D';

// Lab: 프로젝트가 되기 전의 실험작을 모아 두는 페이지
// 실험작을 추가하려면 아래에 <article className="lab-item">을 하나 더 넣는다
const Lab = () => {
  return (
    <section id="lab" className="lab-section">
      <div className="container">
        {/* 화면에는 글 없이 작품만 보여 준다. 제목은 화면 낭독기·검색엔진용으로만 남긴다 */}
        <h2 className="lab-hidden-title">Lab</h2>

        <article className="lab-item">
          {/* 제목·설명은 이름을 정할 때까지 비워 둔다. 다시 넣을 때는 아래 구조를 쓴다
              (<header> 태그는 쓰지 않는다: Header.css가 header 요소를 상단 고정으로 잡는다)
              <div className="lab-item-head">
                <h3 className="lab-item-title">제목</h3>
                <p className="lab-item-desc">설명</p>
              </div> */}
          <LogoGlass3D />
        </article>
      </div>
    </section>
  );
};

export default Lab;
