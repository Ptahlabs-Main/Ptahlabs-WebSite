# 포트폴리오 관리 가이드

**비개발자도 쉽게 프로젝트를 추가/수정할 수 있습니다.**

---

## 빠른 시작

### 새 프로젝트 추가하기

1. **_TEMPLATE 폴더를 복사**합니다
2. 폴더 이름을 `2025_프로젝트명` 형식으로 변경합니다
3. 폴더 안의 `data.json` 파일을 수정합니다
4. 이미지 파일들을 폴더에 추가합니다
5. 빌드 및 배포합니다

### 기존 프로젝트 수정하기

1. 해당 프로젝트 폴더를 찾습니다
2. `data.json` 파일을 수정하거나 이미지를 추가/삭제합니다
3. 빌드 및 배포합니다

---

## 폴더 구조

```
portfolio/
├── _TEMPLATE/              템플릿 폴더 (복사해서 사용)
│   ├── data.json          데이터 템플릿
│   └── README.md          상세 가이드
│
├── 2024_Jecheon_Jummal/   예시 프로젝트
│   ├── data.json
│   └── (이미지 파일들)
│
└── 2025_YourProject/      새 프로젝트
    ├── data.json
    └── (이미지 파일들)
```

---

## data.json 기본 구조

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
  "lastmod": "2025-01-30"
}
```

**중요:**
- `id`는 폴더명과 동일하게 작성
- `images`와 `thumbnail`은 파일명만 입력 (경로 제외)
- 이미지 파일은 같은 폴더에 함께 저장

---

## 설치 실적 지도에 위치 표시 (선택)

메인 페이지 "설치 실적" 지도의 마커를 정확한 위치에 찍으려면 `data.json`에 좌표 한 줄만 추가:

```json
"latlng": [35.1110907, 129.0273199]
```

- 값은 **[위도, 경도]** 원본 숫자만 넣으면 됨 (지도 좌표 변환은 코드가 자동 처리)
- 구글 지도에서 위치 검색 → 주소창 URL의 `!3d` 뒤가 위도, `!4d` 뒤가 경도
- 생략하면 `location`의 도시 중심에 표시됨

---

## 배포하기

프로젝트 추가/수정 후 터미널에서 실행:

```bash
npm run build
git add .
git commit -m "프로젝트 추가/수정"
git push origin main
```

자동으로 배포됩니다 (약 2-3분 소요).

---

## 더 자세한 설명

`_TEMPLATE/README.md` 파일에 상세한 가이드가 있습니다.
예시는 `2024_Jecheon_Jummal` 폴더를 참고하세요.

---

**문의사항이 있으면 개발팀에 연락하세요.**
