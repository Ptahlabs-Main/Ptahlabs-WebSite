# PTAHLABS 웹사이트

미디어아트 & 디지털 전시 솔루션 기업 PTAHLABS 공식 웹사이트.
Next.js(Static Export) + GitHub Pages.

## 개발

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 정적 빌드 (out/ 생성, 인덱스·sitemap 자동 생성)
npm start        # 빌드 결과 로컬 미리보기
```

> ⚠️ `npm run build`는 dev 서버를 끄고 실행할 것 (`.next` 캐시 충돌).

## 프로젝트 추가

1. `public/portfolio/_TEMPLATE/` 복사 → `연도_프로젝트명`으로 폴더명 변경
2. `data.json` 수정 (`id`는 폴더명과 동일, `lastmod` 필수)
3. 이미지/영상을 같은 폴더에 넣고 파일명만 등록
4. `node scripts/generate-index.js` 실행
5. 커밋 & 푸시

준비 중인 프로젝트는 `"hidden": true`로 숨김.
태그는 `public/portfolio/tags.json`에 정의된 영문 태그 사용.

## 배포

```bash
npm run deploy   # 로컬 빌드 후 gh-pages 브랜치로 푸시 (dev 서버 끄고 실행)
```

- GitHub Actions는 사용하지 않음 (요금 문제로 제거, 2026-07)
- **최초 1회 설정 필요**: GitHub → Settings → Pages → Source를
  "Deploy from a branch"로 바꾸고 브랜치를 `gh-pages` / `/ (root)`로 지정
- 커스텀 도메인(ptahlabs.co.kr)은 `public/CNAME`으로 배포에 자동 포함
- `main` 푸시는 소스 백업일 뿐, 배포는 `npm run deploy`를 실행해야 반영됨

## TODO

- [ ] Hero 디자인 확정 (제작된 시안 중 선택 후 적용)
- [ ] 부산 민주공원: `Main.jpg`, `Drawing.jpg`를 data.json의 `thumbnail`/`images`에 연결
- [ ] 신규 프로젝트 3개 내용 채우고 `hidden: false`로 변경
  - 동부권역 학생안전교육원 (`2026_Dongbu_StudentSafety`)
  - 전주 수소 놀이 체험관 (`2026_Jeonju_Hydrogen`)
  - 울산 미래교육관 (`2026_Ulsan_FutureEducation`)
- [ ] AI 활용 솔루션 문구 검토 (`Solution_AI/data.json`)
- [ ] 저장소를 프타랩스 메인 오거나이제이션으로 이전
  1. GitHub → 저장소 Settings → 맨 아래 Danger Zone → **Transfer ownership** → 대상 오거나이제이션 입력
  2. 이전 후 로컬 리모트 변경: `git remote set-url origin https://github.com/<새오거나이제이션>/Ptahlabs-WebSite.git`
  3. 새 저장소에서 Settings → Pages (Source: gh-pages 브랜치)와 커스텀 도메인(ptahlabs.co.kr) 재설정 확인
- [ ] ERP 배포 및 웹사이트 연결
  - 현재 미배포 상태. `erp.ptahlabs.co.kr` 서브도메인으로 올릴 예정
  - 서버 필요 여부 확인 중 (정적 앱이면 GitHub Pages로 무료 호스팅 가능, 백엔드/DB 필요 시 별도 서버 필요)
  - 배포 완료 후 웹사이트 푸터에 링크 추가
- [ ] Google Search Console · 네이버 서치어드바이저 등록, sitemap 제출
- [ ] 솔루션 페이지도 포트폴리오와 같은 미니멀 그리드로 통일 (선택)
- [ ] 전시물 태그를 프로젝트 태그로 자동 병합 (프로젝트 10개 이상 시)

## 문서

- 개발 상세: [CLAUDE.md](./CLAUDE.md)
- SEO: [SEO_가이드.md](./SEO_가이드.md)
- 포트폴리오 데이터 가이드: [public/portfolio/README.md](./public/portfolio/README.md)
