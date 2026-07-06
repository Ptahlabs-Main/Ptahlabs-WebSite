# PTAHLABS 웹사이트 개발 문서

미디어아트·디지털 전시 솔루션 기업 PTAHLABS 공식 웹사이트.

- **스택**: Next.js 15 (Static Export) · React 19 · 순수 CSS · GitHub Pages
- **저장소**: `Ptahlabs-Main/Ptahlabs-WebSite` · **도메인**: ptahlabs.co.kr
- **최종 업데이트**: 2026-07-06 (Hero 세로 라벨 배치, 배포 Actions 재활성화)

> 프로젝트 추가·배포·할 일(TODO)은 [README.md](./README.md), SEO는 [SEO_가이드.md](./SEO_가이드.md) 참고.

---

## 프로젝트 구조

```
pages/                  # Next.js 페이지 (SSG)
  index.js              # 메인
  solution.js           # 솔루션
  history.js            # 연혁 (메뉴 미노출, noindex)
  project/[projectId].js# 프로젝트 상세 (동적)
public/
  portfolio/            # 프로젝트별 독립 폴더 (data.json + 미디어)
    _TEMPLATE/          # 새 프로젝트 템플릿
    index.json          # 프로젝트 목록 (자동 생성)
    tags.json           # 태그 정의 (영문 → 한글 매핑)
  images/logo/          # 로고
  CNAME                 # 커스텀 도메인
  sitemap.xml robots.txt
scripts/
  generate-index.js     # 프로젝트 인덱스 생성
  generate-sitemap.js   # sitemap 생성 (hidden 제외)
src/
  components/
    1_Hero.js LogoLineMotif.js   # Hero (정적) + 로고 라인 문양 벡터
    2_Portfolio.js 3_Solution.js 5_Contact.js 6_History.js
    ProjectDetail.js sections/SectionRenderer.js
    layouts/Header.js layouts/Footer.js
  styles/               # 컴포넌트별 CSS, App.css에서 @import 통합
next.config.js          # static export 설정
```

---

## 주요 기능

- **Hero**: 크림 배경(#f7f5ee) + 로고 라인 문양(`LogoLineMotif.js`, 선 굵기 1px 고정) + 와이드 트래킹 타이포 `PTAHLABS`. 좌우 헤어라인에 세로 라벨(MEDIA ART / DIGITAL EXHIBITION), 모바일에선 상하로 엇갈려 배치. 정적 컴포넌트(무거운 JS 없음).
- **동적 포트폴리오**: 각 프로젝트 `data.json`을 런타임 fetch. 폴더만 추가하면 인식. 태그 필터, 카드 UI, 이미지/비디오 썸네일, 썸네일 없으면 제목 플레이스홀더.
- **섹션 콘텐츠 시스템**: `text` / `image-gallery` / `text-image` / `text-image-sequence` / `exhibits` 5종. `SectionRenderer`로 렌더링, JSON으로 관리.
- **솔루션↔전시 양방향 연결**: `relatedSolution`으로 상호 참조.
- **SEO**: SSG 사전 렌더링, 메타/OG/Twitter/JSON-LD, sitemap·robots 자동.
- **반응형**: 모바일·태블릿·데스크톱, clamp() 유동 폰트, 햄버거 메뉴.

---

## 개발

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 정적 빌드 (out/ + 인덱스·sitemap 자동 생성)
npm start        # 빌드 결과 미리보기
```

> `npm run build`·`deploy`는 dev 서버 끄고 실행 (`.next` 캐시 충돌).

---

## 배포

```bash
npm run deploy   # 인덱스·sitemap 생성 → 빌드 → gh-pages 브랜치 푸시
```

- 푸시되면 GitHub 내장 Pages 빌드(Actions)가 자동으로 굽는다. **Public 레포라 무료.**
- 최초 1회 설정: Settings → Pages → Source `Deploy from a branch` / `gh-pages` / `(root)`, Settings → Actions → General에서 Actions 허용.
- 커스텀 도메인은 `public/CNAME`으로 자동 포함.
- `main` 푸시는 소스 백업일 뿐, 사이트 반영은 `npm run deploy` 실행 시.

---

## SEO

완료: sitemap.xml · robots.txt · 메타태그 · OG · Twitter Card · JSON-LD · canonical.
남음: Google Search Console / 네이버 서치어드바이저 등록 및 sitemap 제출 (`SEO_가이드.md` 참고).

---

## 유지보수

- **새 프로젝트 추가**: `public/portfolio/_TEMPLATE/` 복사 → `연도_프로젝트명`으로 폴더명 변경 → `data.json` 수정(`id`=폴더명, `lastmod` 필수, 태그는 `tags.json`의 영문 태그) → 미디어 넣기 → `node scripts/generate-index.js` → 배포. 상세는 `public/portfolio/README.md`.
- **연락처**: `src/components/5_Contact.js`
- **전역 스타일**: `src/App.css`

### CSS 변수
```css
--primary-color: #28391A;   /* 진한 카키 */
--secondary-color: #C2B8A3; /* 베이지 */
--accent-color: #7A845C;    /* 연한 카키 */
--light-color: #FAF9F6;     /* 배경 */
--text-color: #2C2C2C;      /* 텍스트 */
```
- 타이포: Inter(영문)/Pretendard(한글), clamp() 반응형
- 트랜지션: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`

---

## 알려진 이슈 (Static Export 제한)

- 이미지 최적화 비활성화(`images.unoptimized: true`)
- 서버 API·ISR 불가 → 모든 데이터는 정적 파일(`public/portfolio/`)
- GitHub Pages 반영까지 배포 후 1~2분

---

## 변경 이력 (요약)

- **2026-07**: Hero 최종 디자인 — 크림 배경 + 로고 라인 문양(`LogoLineMotif.js`) + 와이드 트래킹 타이포 + 좌우 세로 라벨(모바일 상하 엇갈림). 서브문구·모서리 로고/이메일 제거, 첫 화면 베이지 꽉 채움. 저장소를 `Ptahlabs-Main`으로 이전, 배포를 gh-pages + 내장 Pages 빌드(Actions)로 정상화. three.js 계열·CI 페이지 제거. 프로젝트 상세 에디토리얼 스타일, 포트폴리오 미니멀 그리드.
- **2025-12**: 휴식정원 프로젝트, 섹션 텍스트/제목 줄바꿈. package.json 정리(약 1000→139), 연혁 페이지, 정보 키오스크 솔루션, 부산 민주공원 콘텐츠, 카드 UI 개편, 비디오 썸네일.
- **2025-10**: Next.js 마이그레이션(SPA→SSG), CSS 모듈화, `SectionRenderer` 분리, 태그 중앙관리(`tags.json`), 런타임 동적 로드, 솔루션 페이지 분리, 비개발자용 폴더 구조.
- **2025-01**: 초기 개발 — 포트폴리오·태그 필터·상세 페이지·SEO·sitemap.
