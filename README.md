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

- `npm run deploy`가 gh-pages 브랜치로 푸시하면, GitHub 내장 Pages 빌드(Actions)가 자동으로 굽는다. Public 레포라 무료.
- **최초 1회 설정**: Settings → Pages → Source `Deploy from a branch` / `gh-pages` / `(root)`, Settings → Actions → General에서 Actions 허용
- 커스텀 도메인(ptahlabs.co.kr)은 `public/CNAME`으로 자동 포함
- `main` 푸시는 소스 백업일 뿐, 배포는 `npm run deploy` 실행 시 반영됨

## TODO

- [ ] 그래피직스(`2025_Graphixis`, 공개·서울): 스켈레톤 상태 → 제목·태그·설명·이미지 채우기 (현재 텍스트 플레이스홀더로 노출 중)
- [ ] 경주 문무대왕(`2025_Gyeongju_Munmu`): 전시물 4개 이미지 임시로 비워둠 → 실제 이미지 확보 시 추가 (대표 이미지는 정상)
- [ ] 신규 프로젝트 3개 내용 채우고 `hidden: false`로 변경
  - 동부권역 학생안전교육원 (`2026_Dongbu_StudentSafety`)
  - 전주 수소 놀이 체험관 (`2026_Jeonju_Hydrogen`)
  - 울산 미래교육관 (`2026_Ulsan_FutureEducation`)
- [ ] 공개 중이나 이미지 없는 솔루션에 썸네일/이미지 추가 (현재 텍스트만 표시)
  - AI 활용 솔루션 (`Solution_AI`)
  - 정보 키오스크 솔루션 (`Solution_InfoKiosk`)
- [ ] 휴식정원 (`2025_MindGarden`, 숨김): 이미지 추가 후 공개 여부 결정
- [ ] 웹사이트 제작 솔루션 (`Solution_Website`, 숨김): 없는 썸네일 `website_temp.jpg` 참조 → 이미지 채우고 공개 여부 결정
- [ ] AI 활용 솔루션 문구 검토 (`Solution_AI/data.json`)
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
