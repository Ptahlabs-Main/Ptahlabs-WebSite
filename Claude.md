# PTAHLABS 웹사이트 개발 문서

**프로젝트명**: PTAHLABS 공식 웹사이트
**개발 기간**: 2025년 1월
**최종 업데이트**: 2026년 7월 6일 (Hero 오로라 그라디언트 배경으로 교체, three.js 제거)
**기술 스택**: Next.js, React, GitHub Pages

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [주요 기능](#주요-기능)
5. [개발 가이드](#개발-가이드)
6. [배포 가이드](#배포-가이드)
7. [SEO 설정](#seo-설정)
8. [유지보수 가이드](#유지보수-가이드)

---

## 🎯 프로젝트 개요

PTAHLABS는 미디어아트와 디지털 전시 솔루션 전문 기업의 공식 웹사이트입니다.

### 주요 목적
- 회사 및 서비스 소개
- 프로젝트 포트폴리오 전시
- 고객 문의 접수

### 타겟 사용자
- 전시 기획자
- 박물관 및 미술관 관계자
- 문화 콘텐츠 제작자
- B2B 클라이언트

---

## 🛠 기술 스택

### Frontend
- **Next.js** 15.5.4 (Static Export)
- **React** 19.1.0
- **CSS3** (순수 CSS, no framework)

### 빌드 & 배포
- **Next.js Static Export** (SSG)
- **GitHub Pages**
- **gh-pages** (로컬 빌드 후 수동 배포, `npm run deploy`)

### 주요 라이브러리
- Font Awesome 6.4.0
- Google Fonts (Inter, Pretendard)

---

## 📁 프로젝트 구조

```
WebSite/
├── pages/                      # Next.js 페이지 (SSG)
│   ├── _app.js                 # App 래퍼
│   ├── _document.js            # HTML 문서 구조
│   ├── index.js                # 메인 페이지
│   ├── solution.js             # 솔루션 페이지
│   ├── history.js              # 연혁 페이지 (메뉴 미노출, noindex)
│   └── project/
│       └── [projectId].js      # 동적 프로젝트 상세 페이지
├── public/
│   ├── images/
│   │   └── logo/               # 로고 이미지
│   ├── portfolio/              # 프로젝트 데이터 관리
│   │   ├── _TEMPLATE/          # 템플릿 폴더
│   │   │   ├── data.json       # 데이터 템플릿
│   │   │   └── README.md       # 상세 가이드
│   │   ├── 2024_Jecheon_Jummal/
│   │   │   ├── data.json       # 프로젝트 데이터
│   │   │   └── (이미지들)
│   │   ├── index.json          # 프로젝트 목록 (자동 생성)
│   │   ├── tags.json           # 태그 정의 및 카테고리
│   │   └── README.md           # 간단 가이드
│   ├── sitemap.xml             # 검색 엔진 sitemap (자동 생성)
│   └── robots.txt              # 크롤러 설정
├── scripts/
│   ├── generate-index.js       # 프로젝트 인덱스 자동 생성
│   ├── generate-sitemap.js     # Sitemap 자동 생성
│   ├── split-projects.js       # 프로젝트 분리 (1회용)
│   └── copy-images.js          # 이미지 복사 (1회용)
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── Header.js       # 네비게이션 헤더
│   │   │   └── Footer.js       # 푸터
│   │   ├── sections/
│   │   │   └── SectionRenderer.js  # 섹션 렌더러 컴포넌트
│   │   ├── 1_Hero.js           # 메인 배너
│   │   ├── HeroAuroraEffect.js # Hero 오로라 그라디언트 배경
│   │   ├── 2_Portfolio.js      # 포트폴리오 섹션
│   │   ├── 3_Solution.js       # 솔루션 섹션
│   │   ├── 5_Contact.js        # 연락처 섹션
│   │   ├── 6_History.js        # 회사 연혁 (메뉴 미노출)
│   │   └── ProjectDetail.js    # 프로젝트 상세 페이지 컴포넌트
│   ├── styles/                 # CSS 모듈화
│   │   ├── common.css          # 기본 스타일 및 변수
│   │   ├── Header.css          # 헤더 스타일
│   │   ├── Hero.css            # Hero 섹션 스타일
│   │   ├── Portfolio.css       # 포트폴리오 스타일
│   │   ├── ProjectDetail.css   # 프로젝트 상세 스타일
│   │   ├── History.css         # 연혁 스타일
│   │   ├── Contact.css         # 연락처 스타일
│   │   ├── Footer.css          # 푸터 스타일
│   │   └── responsive.css      # 반응형 미디어 쿼리
│   └── App.css                 # CSS 통합 (모든 스타일 import)
├── next.config.js              # Next.js 설정 (static export)
├── SEO_가이드.md               # SEO 최적화 가이드
├── CLAUDE.md                   # 이 문서
├── README.md                   # 배포 가이드
└── package.json                # 의존성 및 스크립트

```

---

## ✨ 주요 기능

### 1. 인터랙티브 Hero 섹션
- **오로라 그라디언트 배경** (HeroAuroraEffect.js)
- 브랜드 컬러(카키/베이지)의 블러 블롭 3개가 천천히 부유하는 애니메이션
- **마우스 인터랙션**: 글로우가 마우스를 부드럽게 따라옴 (CSS 변수 + rAF 보간)
- `prefers-reduced-motion` 설정 시 애니메이션 자동 비활성화
- 순수 CSS + 경량 JS (three.js 제거로 번들 크기 대폭 감소)
- 스크롤 블렌딩 효과 (150-350px)

### 2. 반응형 디자인
- 모바일, 태블릿, 데스크톱 완벽 지원
- 햄버거 메뉴 (모바일)
- clamp() 함수로 유동적인 폰트 크기

### 3. 동적 포트폴리오
- **런타임 동적 로드**: 각 프로젝트의 data.json을 실시간으로 불러옴
- **폴더 기반 관리**: 프로젝트별 독립 폴더 (`public/portfolio/프로젝트명/`)
- **태그 시스템**: tags.json으로 중앙 관리, 한글명 자동 표시
- **카드 UI**: 이미지 + 제목/연도가 분리된 카드 형식
- **호버 오버레이**: 마우스 오버 시 태그 표시
- **비디오 썸네일 지원**: mp4, webm, ogg, mov 형식 자동 재생
- 태그 기반 필터링 (인터랙티브, 전시, 역사 등)
- 프로젝트 클릭 시 상세 페이지로 이동
- 썸네일 없는 경우 제목 텍스트로 플레이스홀더 표시

### 4. 섹션 기반 콘텐츠 시스템
- **5가지 섹션 타입** 지원으로 자유로운 레이아웃 구성
  - `text`: 텍스트 섹션
  - `image-gallery`: 이미지 슬라이더 (좌우 네비게이션)
  - `text-image`: 텍스트+이미지 조합 (image-left, image-right, image-top 레이아웃)
  - `text-image-sequence`: 여러 텍스트+이미지 쌍 반복
  - `exhibits`: 전시물 카드 그리드
- **SectionRenderer 컴포넌트**: 재사용 가능한 섹션 렌더링 로직
- JSON 기반 콘텐츠 관리로 비개발자도 쉽게 편집 가능

### 5. 라우팅
- **Next.js 파일 기반 라우팅** (정적 내보내기)
- 메인 페이지: `/`
- 솔루션 페이지: `/solution/`
- 프로젝트 상세: `/project/[projectId]/`
- 연혁 페이지: `/history/` (메뉴 미노출, noindex)
- SEO 친화적 URL (# 없음)

### 6. SEO 최적화
- **Next.js SSG로 완전한 HTML 사전 렌더링**
- 메타 태그 (description, keywords, Open Graph, Twitter Card)
- Schema.org Structured Data (JSON-LD)
- Sitemap.xml 자동 생성
- robots.txt 설정

### 7. 배포
- `npm run deploy`로 로컬 빌드 후 gh-pages 브랜치에 배포 (GitHub Actions 미사용)
- 프로젝트 인덱스 빌드 시 자동 생성
- Sitemap 빌드 시 자동 생성 (hidden 프로젝트 제외)

---

## 💻 개발 가이드

### 설치

```bash
# 저장소 클론
git clone https://github.com/2025-Ptahlabs/ptahlabs.git
cd WebSite

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```
- 로컬 서버: http://localhost:3000 (포트 충돌 시 자동으로 3001 사용)

### 빌드

```bash
npm run build
```
- 프로젝트 인덱스와 Sitemap이 자동으로 생성되고, out 폴더에 정적 HTML 생성

### 빌드 결과 미리보기

```bash
npm start
```
- out 폴더를 로컬 서버로 실행 (빌드 후 테스트용)

### Sitemap 수동 생성

```bash
npm run sitemap
```

---

## 🚀 배포 가이드

**GitHub Actions는 사용하지 않습니다** (비공개 저장소 요금 문제로 2026-07 제거).
배포는 로컬에서 직접 실행합니다:

```bash
npm run deploy
```

이 명령이 자동으로:
1. 프로젝트 인덱스 생성 (index.json)
2. Sitemap 생성 (hidden 프로젝트 제외)
3. Next.js 빌드 (SSG, out/ 생성)
4. out 폴더를 gh-pages 브랜치로 푸시 → GitHub Pages 반영

주의사항:
- **dev 서버를 끄고 실행할 것** (.next 캐시 충돌)
- `main` 푸시는 소스 백업일 뿐, 사이트 반영은 `npm run deploy` 실행 시에만 됨
- 최초 1회: GitHub Settings → Pages → Source를 "Deploy from a branch: gh-pages / (root)"로 설정

---

## 🔍 SEO 설정

### 이미 완료된 설정
✅ sitemap.xml
✅ robots.txt
✅ Meta tags (description, keywords)
✅ Open Graph tags
✅ Twitter Card tags
✅ Schema.org JSON-LD
✅ Canonical URL

### 검색 엔진 등록 필요
아직 완료되지 않은 작업:

1. **Google Search Console 등록**
   - `/public/index.html` 34번 줄 주석 해제
   - Google verification 코드 입력

2. **네이버 서치 어드바이저 등록**
   - `/public/index.html` 31번 줄 주석 해제
   - 네이버 verification 코드 입력

3. **Sitemap 제출**
   - Google: https://search.google.com/search-console
   - 네이버: https://searchadvisor.naver.com/

자세한 내용은 `SEO_가이드.md`를 참고하세요.

---

## 🔧 유지보수 가이드

### 향후 개선 작업 (TODO)

**전시물 태그 자동 병합 기능**
- 현재: 프로젝트 상단 tags는 수동으로 입력
- 개선: exhibits 섹션 내 전시물들의 tags를 자동으로 상단 프로젝트 tags에 포함
- 작업 방법:
  1. 모든 프로젝트 data.json 일괄 업데이트 스크립트 작성
  2. ProjectDetail.js에서 동적으로 태그 병합 로직 추가
  3. 중복 제거 및 카테고리별 정렬
- 우선순위: 중간 (프로젝트 10개 이상 누적 시 진행)

### 새 프로젝트 추가하기 (비개발자용)

**이제 개발 지식 없이도 쉽게 프로젝트를 추가할 수 있습니다!**

#### 1단계: 템플릿 복사
`/public/portfolio/_TEMPLATE/` 폴더를 복사해서 새 프로젝트 이름으로 변경
- 폴더명 형식: `2025_ProjectName` (연도_프로젝트명)

#### 2단계: data.json 수정
복사한 폴더의 `data.json` 파일을 텍스트 에디터로 열어서 수정:

```json
{
  "id": "2025_ProjectName",
  "title": "프로젝트 제목",
  "category": "전시",
  "tags": ["exhibition", "interactive"],
  "images": ["image1.jpg", "image2.jpg"],
  "thumbnail": "image1.jpg",
  "description": "짧은 설명",
  "year": "2025",
  "client": "클라이언트명",
  "location": "도시, 대한민국",
  "country": "KR",
  "lastmod": "2025-10-01"
}
```

**중요**:
- `id`는 폴더명과 동일하게!
- 이미지 경로는 파일명만 입력 (예: `"image1.jpg"`)
- **태그는 영문으로 입력**: `tags.json`에 정의된 태그 사용 (자동으로 한글 표시됨)
  - 예: `"interactive"` → 화면에 "인터랙티브"로 표시
  - 사용 가능한 태그: `interactive`, `media-art`, `kiosk`, `exhibition`, `history` 등
  - 새 태그 추가 시 `/public/portfolio/tags.json` 수정 필요
- **`lastmod` 필드 필수**: 프로젝트를 수정할 때마다 `lastmod` 날짜를 업데이트해야 합니다
  - 형식: `"YYYY-MM-DD"` (예: `"2025-10-09"`)
  - 이 값은 sitemap.xml에 반영되어 검색 엔진이 최신 콘텐츠를 인식합니다
  - **프로젝트 내용 수정 시 반드시 업데이트!**

#### 3단계: 미디어 추가
프로젝트 폴더에 이미지/비디오 파일 복사
- **이미지**: jpg, png, webp 등
- **비디오 썸네일**: mp4, webm, ogg, mov (자동 재생, 음소거, 루프)

#### 4단계: 인덱스 생성 (필수!)
새 프로젝트 추가 후 **반드시** 인덱스를 재생성해야 포트폴리오에 표시됩니다:
```bash
node scripts/generate-index.js   # 개발 중 수동 실행
# 또는
npm run build                    # 빌드 시 자동 생성
```

#### 5단계: 배포
```bash
git add .
git commit -m "새 프로젝트 추가: 프로젝트명"
git push origin main
```

**자세한 가이드**: `/public/portfolio/README.md` 참고

### 연락처 수정

`/src/components/5_Contact.js` 파일 수정

### 스타일 수정

`/src/App.css` 파일에서 전역 스타일 수정

#### 주요 CSS 변수:
```css
:root {
  --primary-color: #28391A;    /* 진한 카키 */
  --secondary-color: #C2B8A3;  /* 베이지 */
  --accent-color: #7A845C;     /* 연한 카키 */
  --light-color: #FAF9F6;      /* 배경색 */
  --text-color: #2C2C2C;       /* 텍스트 */
}
```

---

## 🌈 디자인 시스템

### 색상 팔레트
- **Primary (진한 카키)**: #28391A - 로고, 제목, 버튼
- **Secondary (베이지)**: #C2B8A3 - 테두리, 서브 요소
- **Accent (연한 카키)**: #7A845C - 강조, 호버 상태
- **Light (배경)**: #FAF9F6 - 기본 배경
- **Text**: #2C2C2C - 본문 텍스트

### 타이포그래피
- **제목**: Inter (영문), Pretendard (한글)
- **본문**: Pretendard
- **크기**: clamp()로 반응형 처리

### 애니메이션
- **Transition**: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover**: translateY, scale, box-shadow 효과

---

## 📊 성능 최적화

### 이미지 최적화
- WebP 포맷 권장
- 적절한 해상도로 압축
- Lazy loading 적용 고려

### 코드 최적화
- CSS는 모듈화되어 있지 않음 (필요시 CSS Modules로 전환 가능)
- React.memo 사용 고려
- 번들 크기 모니터링

---

## 🐛 알려진 이슈

### Next.js Static Export 제한사항
- **이미지 최적화 비활성화**: `images.unoptimized: true` 설정 필요
- **서버 API 사용 불가**: 모든 데이터는 정적 파일로 관리 (public/portfolio/)
- **ISR 사용 불가**: Static Export 모드에서는 Incremental Static Regeneration 미지원

### GitHub Pages 특성
- 빌드 후 배포까지 약 1-2분 소요
- gh-pages 브랜치를 통한 배포
- 커스텀 도메인 설정 가능

---

## 📞 문의 및 지원

- **개발 담당**: Claude (AI Assistant)
- **이슈 보고**: GitHub Issues
- **배포 문제**: `npm run deploy` 출력 및 gh-pages 브랜치 확인

---

## 📝 변경 이력

### 2026-07-06
- **Hero 최종 디자인 적용 (설계도 스타일, 시안 4)**
  - 크림색 배경(#f7f5ee) + 로고 라인 문양을 배경 중앙에 배치
  - **로고를 벡터로 재제작**: src/components/LogoLineMotif.js
    - 원본 PNG(Line@4x.png) 픽셀 분석으로 전체 선분 좌표를 추출해 SVG로 트레이싱
    - 접점 스냅 정리 + 원본의 두께 표현 이중선 제거 (배경용 단순화 버전, 실루엣 동일)
    - vector-effect: non-scaling-stroke로 어떤 크기에서도 선 굵기 1px 유지
    - stroke가 currentColor를 따라 CSS로 색상 제어 가능
    - `showFaces` prop: 면 단위 폴리곤 그룹 (향후 로고 내부에 작업물 영상/이미지를
      마스크로 채우는 연출용으로 구조화해둠)
  - 와이드 트래킹(0.4em) 볼드(700) 타이포 PTAHLABS, 최대 5.2rem
  - 좌우 가장자리에 세로 헤어라인 장식 (모바일에서는 숨김)
  - 마우스 스포트라이트 JS 제거 (Hero가 순수 정적 컴포넌트로)
  - pages/hero-drafts.js: 시안 비교용 임시 페이지 (noindex, 확정 후 삭제 예정)
- **Hero 다크 테마 전환 (4차, 오로라 제거)**
  - HeroAuroraEffect.js 삭제, 다크 배경(#14170f) + 좌측 정렬 대형 타이포(최대 9rem)
  - 타이틀에 화이트→세이지 그라디언트, 마우스 스포트라이트 + 필름 그레인
  - 스크롤 시 라이트 섹션으로 블렌딩 유지
- **프로젝트 상세 페이지 에디토리얼 스타일 개편**
  - 흰 박스/카드 전부 제거 → 여백과 헤어라인(1px)으로 구분
  - 섹션 제목을 소형 악센트 라벨 스타일로 변경
  - 전시물: 카드 → 이미지+텍스트 오픈 레이아웃, 간격 72px
  - 솔루션 바로가기 버튼을 전체폭 → 인라인으로 변경
- **project/[projectId].js `<title>` React 경고 수정** (템플릿 리터럴로)
- **GitHub Actions 배포 제거 → 로컬 배포로 전환**
  - .github/workflows/deploy.yml 삭제 (Actions 요금 문제)
  - 배포는 `npm run deploy` (gh-pages 패키지로 gh-pages 브랜치 푸시)
  - GitHub Settings → Pages → Source를 "Deploy from a branch: gh-pages"로 변경 필요 (1회)
- **sitemap 생성 스크립트 개선**
  - hidden: true 프로젝트를 sitemap에서 제외
- **README 전면 재작성**
  - CRA 시절 배포 가이드 삭제, 현재 Next.js 워크플로 기준으로 간결화
  - TODO 리스트 추가
- **포트폴리오 필터 위치 이동**
  - 카테고리 버튼을 섹션 타이틀 우측(같은 행)으로 배치
  - 세부 태그 행은 선택 시 그 아래 표시
- **Hero 오로라 선명도 강화**
  - 블롭 blur 90→60px, 채도·불투명도 상향, 마우스 글로우 강화
- **프로젝트 상세 페이지 디자인 통일**
  - 베이지 그라데이션 박스 → 흰 배경 + 연한 보더 + radius 20px
  - 태그를 솔리드 알약 → 소프트 카키 칩으로 변경
  - 두꺼운 테두리(2px accent) 전부 1px 연한 보더로 교체
- **CI 페이지/섹션 제거**
  - pages/ci.js, src/components/4_CI.js, src/styles/CI.css 삭제
  - 헤더 메뉴, 메인 페이지 섹션, sitemap에서 CI 제거
  - CRA 잔재 파일 정리 (src/App.js, src/index.js 삭제)
- **Hero 미니멀화 (3차)**
  - 아이브로우 칩, 버튼 2개, 스크롤 힌트 모두 제거
  - 타이틀 + 한 줄 소개만 남김 (오로라 배경 유지)
- **포트폴리오 그리드 미니멀 개편**
  - 카드 박스(배경/보더/그림자) 제거 → 이미지 + 라벨 + 제목 구성
  - 라벨: 태그 최대 2개 + 연도 (예: "전시 · 미디어아트 · 2025")
  - 섹션 타이틀/필터 좌측 정렬, 타이틀 대형화 (최대 4rem)
- **신규 프로젝트 3개 파일 생성 (내용 미정, hidden: true)**
  - 2026_Dongbu_StudentSafety (동부권역 학생안전교육원)
  - 2026_Jeonju_Hydrogen (전주 수소 놀이 체험관)
  - 2026_Ulsan_FutureEducation (울산 미래교육관)
  - 내용 확정 시 data.json 채우고 `hidden: false`로 변경
- **Hero 섹션 디자인 2차 개선**
  - 상단에 아이브로우 칩 추가 (MEDIA ART & DIGITAL EXHIBITION)
  - 타이틀 대형화 (최대 7rem) + 카키 그라디언트 텍스트
  - 콘텐츠 순차 등장 애니메이션 (hero-rise, reduced-motion 배려)
  - 하단 스크롤 힌트 (마우스 아이콘, 클릭 시 포트폴리오로 이동)
  - 오로라 블롭 채도/투명도 강화 + 필름 그레인 질감 오버레이
  - 배경 그라디언트를 블루톤 → 웜 그린톤으로 변경
- **AI 활용 솔루션 모음 추가**
  - public/portfolio/Solution_AI/data.json 생성 (AI 도슨트 챗봇, AI 사료 검색, AI 포토부스, 생성형 미디어아트, AI 음성 안내)
  - tags.json에 `ai` 태그 추가 (기술 카테고리)
  - 기존 정보 키오스크/포토부스 솔루션과 relatedSolution으로 연결
- **전체 디자인 현대화**
  - 버튼: 반투명 글래스 + 대문자 → 솔리드 컬러 + 미니멀 스타일, focus-visible 지원
  - 섹션 타이틀: 하단 언더라인 바 제거, letter-spacing 타이트하게
  - 헤더: 글래스모피즘 강화 (blur+saturate), 그림자·보더 은은하게
  - 포트폴리오/솔루션 카드: 흰색 배경 + radius 20px + 연한 보더, 호버 오버레이 제거하고 태그를 카드 하단에 상시 노출
  - 필터 버튼: 아웃라인 칩 스타일로 절제
  - 스크롤 진입 시 카드 페이드업 (CSS scroll-driven animation, 지원 브라우저 한정, reduced-motion 배려)
- **Hero 인터랙티브 배경 교체 (3D 공 → 오로라 그라디언트)**
  - HeroBaubleEffect.js 삭제, HeroAuroraEffect.js 신규 생성
  - 브랜드 컬러 블러 블롭 3개 + 마우스를 따라오는 글로우 (CSS 변수 + rAF 보간)
  - `prefers-reduced-motion` 사용자는 애니메이션 자동 비활성화
  - three, @react-three/fiber, @react-three/drei, @react-three/postprocessing 의존성 제거 (71개 패키지 감소)
  - Hero 타이틀/서브타이틀의 `-webkit-text-stroke` 제거 (은은한 배경에서 불필요)
  - 메인 페이지 First Load JS 103kB로 감소

### 2025-12-04
- **휴식정원 프로젝트 추가**
  - public/portfolio/2025_MindGarden/data.json 생성
  - 공모전 기획안 (멘탈 웰니스 앱 컨셉)
  - sections 형식으로 기획 의도, 핵심 기능 설계, 기술 스택, 프로토타입 섹션 구성
- **섹션 텍스트 줄바꿈 지원**
  - `.section-text p`에 `white-space: pre-line` 추가
  - data.json에서 `\n`으로 줄바꿈 가능
- **포트폴리오 제목 줄바꿈**
  - ` / ` 구분자로 긴 제목 줄바꿈 처리
  - 예: "부산 민주공원 / 민주주의기록관", "휴식정원 / Mind Garden Diary"

### 2025-12-03
- **package.json 정리**
  - 불필요한 의존성 제거: react-router-dom, react-scripts, @testing-library/*, cra-template, web-vitals
  - eslintConfig, browserslist 설정 제거
  - 패키지 수 약 1000개 → 139개로 감소
- **연혁 페이지 추가**
  - pages/history.js, src/components/6_History.js, src/styles/History.css 생성
  - 2025년 회사 연혁 타임라인 표시
  - 메뉴에는 미노출, robots noindex 설정
- **정보 키오스크 솔루션 추가**
  - public/portfolio/Solution_InfoKiosk/data.json 생성
  - 엑셀 기반 데이터 관리, 키워드 검색, 커스터마이징 가능
  - 부산 민주공원 민주주의기록관과 연결
- **부산 민주공원 민주주의기록관 콘텐츠 추가**
  - 8개 전시물 상세 정보 추가 (디지털 멀티비전, 유월길 열기를 따라, 6월 우리들의 이야기 등)
  - hidden: false로 변경하여 포트폴리오에 표시
- **포트폴리오/솔루션 카드 UI 전면 개편**
  - 호버 오버레이 방식 → 카드 형식 (이미지 + 제목/연도 분리)
  - 포트폴리오: 호버 시 태그 오버레이 표시
  - 솔루션: 이미지 + 제목 + 설명 + 링크 카드 형식
  - 썸네일 없는 경우 제목 전체 텍스트로 플레이스홀더 표시
- **비디오 썸네일 지원**
  - mp4, webm, ogg, mov 확장자 자동 인식
  - 자동 재생 (muted, loop, playsInline, autoPlay)
  - 포트폴리오/솔루션 모두 적용

### 2025-10-09
- **Next.js 마이그레이션 완료**
- React SPA → Next.js Static Export (SSG) 전환
- SEO 개선: 모든 페이지 HTML 사전 렌더링
- HashRouter 제거, Next.js 파일 기반 라우팅 적용
- pages/ 폴더 구조로 전환 (_app.js, _document.js, index.js, solution.js, project/[projectId].js)
- 모든 컴포넌트에서 useRouter (next/router)로 변경
- 이미지 경로를 절대 경로로 변경 (/portfolio/)
- Sitemap URL에서 # 제거
- GitHub Actions 배포 스크립트 업데이트 (out 폴더 배포)
- **섹션 렌더링 로직 컴포넌트 분리**
- src/components/sections/SectionRenderer.js 생성
- ProjectDetail.js 리팩토링 (150+ 줄 → 컴포넌트 사용)
- 코드 재사용성 및 유지보수성 향상
- **CSS 파일 컴포넌트별 분리**
- src/styles/ 폴더 생성 및 CSS 모듈화
- common.css: 기본 스타일 및 CSS 변수
- Header.css: 헤더 네비게이션
- Hero.css: 히어로 섹션 (블렌딩 효과 포함)
- Portfolio.css: 포트폴리오 필터링 및 그리드
- ProjectDetail.css: 프로젝트 상세 페이지 (섹션 렌더링 포함)
- CI.css: CI 섹션
- Contact.css: 연락처 섹션
- Footer.css: 푸터 및 파트너 섹션
- responsive.css: 미디어 쿼리
- App.css는 @import로 모든 CSS 통합
- 유지보수성 및 코드 가독성 향상
- **스크롤 효과 개선**
- Hero-Portfolio 블렌딩 효과: 150-350px 범위에서 점진적으로 나타남
- 헤더 페이드인: 100-300px 범위에서 점진적으로 나타남
- 스크롤 스냅 기능 추가 (scroll-snap-type: y proximity)
- Hero와 Portfolio 섹션에서 자동으로 멈춤
- **Hero 섹션 인터랙션 개선**
- 3D 공들이 마우스를 따라오도록 변경 (기존: 마우스를 피함)
- 인터랙션 범위 증가 (10 → 15)
- 끌어당기는 힘 증가 (0.5 → 0.8)
- 클릭 시 공들이 퍼지는 폭발 효과 추가
- 폭발 범위: 25, 폭발력: 30, 3 프레임 지속
- 폭발 시 충돌 감지 약화 (1.5 → 0.3)로 퍼짐 효과 개선
- **CI 섹션 개선**
- CI 로고 이미지 경로 수정 (상대 경로 → 절대 경로)
- CI 타이틀과 로고 간격 조정 (margin-top: 60px, margin-bottom: 200px)
- **양방향 솔루션-전시 연결 시스템 개선**
- 솔루션 페이지: 하단에 "적용 사례" 섹션 표시 (관련 전시 카드)
- 전시 페이지: 전시물 카드에 "솔루션 바로가기" 버튼 표시
- ProjectDetail.js에서 `isSolution` 플래그로 조건부 렌더링
- 적용 사례 썸네일을 실제 전시 이미지로 변경
  - 비콘 도슨트 솔루션 → 원주 과학관의 BeaconDocent.jpg
  - 포토부스 솔루션 → 제천 점말동굴의 PhotoBooth.JPEG
- **솔루션 바로가기 버튼 UI/UX 개선**
- 전시물 카드 하단에 전체 너비로 고정 배치 (margin-top: auto)
- 카키색(#7A845C) 배경으로 일관된 디자인
- 호버 시 위로 올라가는 효과 + 그림자 추가
- 카드 콘텐츠를 flex column으로 변경하여 레이아웃 개선

### 2025-10-02 (오후)
- **태그 시스템 중앙 관리**
- `tags.json` 추가: 모든 태그 정의를 중앙에서 관리
- 태그 카테고리: 기술(technology), 분야(genre), 솔루션(solution), 체험(experience)
- 각 태그에 한글명, 설명 추가 (예: `interactive` → `인터랙티브`)
- Portfolio/ProjectDetail/Solution 컴포넌트에서 한글명 자동 표시
- 솔루션 페이지 별도 분리 (`/solution`)
- 비콘 도슨트 솔루션 추가

### 2025-10-02 (오전)
- **런타임 동적 로드 방식으로 전환**
- 빌드 시 병합 불필요: 각 프로젝트 data.json을 런타임에 fetch
- `generate-index.js` 추가: 프로젝트 목록 자동 생성
- `merge-projects.js` 삭제: 더 이상 병합 과정 불필요
- `public/images/portfolio` 삭제: 이미지가 각 프로젝트 폴더로 이동
- Portfolio/ProjectDetail 컴포넌트: useEffect로 동적 로드
- Sitemap 스크립트: portfolio 폴더 직접 스캔으로 변경
- 프로젝트 추가 시 폴더만 생성하면 자동 인식

### 2025-10-01
- **비개발자용 포트폴리오 관리 시스템 구축**
- `/public/portfolio/` 폴더 구조로 개편
- 각 프로젝트가 독립 폴더로 관리 (data.json + 이미지)
- `merge-projects.js` 스크립트 추가 (자동 병합)
- 프로젝트 템플릿 및 가이드 작성
- 비개발자도 쉽게 프로젝트 추가/수정 가능

### 2025-01-30
- 초기 개발 완료
- 포트폴리오 시스템 구현
- JSON 기반 프로젝트 관리
- 태그 필터링 기능
- 프로젝트 상세 페이지
- SEO 최적화 완료
- 자동 배포 설정
- 동적 Sitemap 생성기

---

## 🎓 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev/)
- [GitHub Pages 가이드](https://pages.github.com/)
- [SEO 가이드](./SEO_가이드.md)
- [배포 가이드](./README.md)

---

**이 문서는 Claude AI가 작성했습니다.**
**최종 검토**: 2025년 12월 4일