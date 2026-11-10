const fs = require('fs');
const path = require('path');
const ClipperLib = require('clipper-lib');

/**
 * 대한민국 시·도 경계 SVG 경로(src/components/koreaMapData.js) 생성 스크립트
 *
 * 입력: scripts/data/ne_korea_admin1.geojson
 *   - Natural Earth 10m Admin 1 (naturalearthdata.com, 퍼블릭 도메인)에서
 *     대한민국(KOR) 피처만 추출하고 이름/좌표만 남긴 파일
 * 처리:
 *   1. 경위도 → 지도 좌표 투영 (x = (경도 - 125.7) * 100, y = (38.65 - 위도) * 124)
 *   2. 시·도마다 "다른 시·도를 GAP 만큼 넓힌 영역"을 잘라냄
 *      → 인접 경계만 양쪽에서 GAP 씩 물러나 띄어져 보이고, 해안선·섬은 원본 그대로 유지
 *      (Clipper 폴리곤 연산 사용: 꼭짓점을 직접 밀던 예전 방식과 달리 예각에서 돌기가 생기지 않음)
 *   3. 너무 작은 조각 제거, 거의 일직선 위 꼭짓점 정리, 소수점 1자리 반올림
 *
 * 실행: node scripts/generate-korea-map.js
 */

const INPUT_FILE = path.join(__dirname, 'data/ne_korea_admin1.geojson');
const OUTPUT_FILE = path.join(__dirname, '../src/components/koreaMapData.js');

const VIEWBOX = '0 0 405 690';
const GAP = 1.5; // 인접 경계에서 각 시·도가 물러나는 폭 (지도 좌표 단위, 경계 사이 간격 = GAP * 2)
const MIN_AREA = 1.5; // 이 면적(지도 좌표 단위²) 미만 조각(아주 작은 섬 등)은 버림
// 원본에서 한 덩어리였던 폴리곤이 인접 경계를 잘라내며 여러 조각으로 갈라졌을 때,
// 가장 큰 조각 대비 이 비율 미만인 조각은 버림 (좁은 띠가 잘려 떨어진 쪼가리 제거)
const MIN_FRAGMENT_RATIO = 0.1;
const CLEAN_TOLERANCE = 0.08; // 거의 일직선 위 꼭짓점 제거 허용치
const SCALE = 1000; // Clipper 정수 좌표 스케일

// Natural Earth 영문명 → 사이트에서 쓰는 시·도 약칭 (4_LocationMap.js의 REGION_OF_CITY와 일치해야 함)
const REGION_NAME = {
  Gangwon: '강원',
  Gyeonggi: '경기',
  'South Chungcheong': '충남',
  Incheon: '인천',
  'North Jeolla': '전북',
  'South Jeolla': '전남',
  'South Gyeongsang': '경남',
  Busan: '부산',
  Ulsan: '울산',
  'North Gyeongsang': '경북',
  Jeju: '제주',
  Seoul: '서울',
  Daejeon: '대전',
  Sejong: '세종',
  'North Chungcheong': '충북',
  Gwangju: '광주',
  Daegu: '대구',
};

const project = ([lng, lat]) => ({
  X: Math.round((lng - 125.7) * 100 * SCALE),
  Y: Math.round((38.65 - lat) * 124 * SCALE),
});

// GeoJSON 지오메트리 → 폴리곤(외곽 + 구멍)별로 방향이 정리된 Clipper 경로 배열
function toPolygons(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map((polygon) =>
    ClipperLib.Clipper.SimplifyPolygons(
      polygon.map((ring) => ring.map(project)),
      ClipperLib.PolyFillType.pftNonZero
    )
  );
}

// 경로들을 delta 만큼 바깥으로 넓힘 (겹치는 부분은 합쳐짐)
function expand(paths, delta) {
  const offset = new ClipperLib.ClipperOffset(2, 0.25 * SCALE); // miterLimit 2 → 예각은 깎아냄
  offset.AddPaths(paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
  const result = new ClipperLib.Paths();
  offset.Execute(result, delta * SCALE);
  return result;
}

// subject − clip
function subtract(subject, clip) {
  const clipper = new ClipperLib.Clipper();
  clipper.AddPaths(subject, ClipperLib.PolyType.ptSubject, true);
  clipper.AddPaths(clip, ClipperLib.PolyType.ptClip, true);
  const result = new ClipperLib.Paths();
  clipper.Execute(
    ClipperLib.ClipType.ctDifference,
    result,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );
  return result;
}

const area = (p) => Math.abs(ClipperLib.Clipper.Area(p)) / (SCALE * SCALE);

// 뷰박스 밖에 완전히 벗어난 조각(울릉도·독도 등)인지
const [VB_X, VB_Y, VB_W, VB_H] = VIEWBOX.split(" ").map(Number);
const outsideViewbox = (p) =>
  p.every(({ X }) => X / SCALE < VB_X) || p.every(({ X }) => X / SCALE > VB_X + VB_W) ||
  p.every(({ Y }) => Y / SCALE < VB_Y) || p.every(({ Y }) => Y / SCALE > VB_Y + VB_H);

function toPathData(paths) {
  return paths
    .map((p) => 'M' + p.map(({ X, Y }) => `${(X / SCALE).toFixed(1)},${(Y / SCALE).toFixed(1)}`).join('L') + 'Z')
    .join('');
}

function generate() {
  console.log('시·도 경계 SVG 경로 생성 중...');
  const geojson = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

  const inputs = [];
  geojson.features.forEach((feature) => {
    const name = REGION_NAME[feature.properties.name];
    if (!name) {
      console.warn(`매핑되지 않은 지역, 건너뜀: ${feature.properties.name}`);
      return;
    }
    inputs.push({ name, polygons: toPolygons(feature.geometry) });
  });

  const regions = inputs.map((region) => {
    const others = inputs.filter((r) => r !== region).flatMap((r) => r.polygons.flat());
    const clip = expand(others, GAP);
    let fragments = 0;

    // 원본 폴리곤 하나씩 잘라내고, 갈라져 나온 자잘한 쪼가리는 버림
    const cleaned = region.polygons.flatMap((polygon) => {
      const cut = ClipperLib.Clipper.CleanPolygons(subtract(polygon, clip), CLEAN_TOLERANCE * SCALE).filter(
        (p) => p.length >= 3 && area(p) >= MIN_AREA && !outsideViewbox(p)
      );
      const outers = cut.filter((p) => ClipperLib.Clipper.Orientation(p));
      const holes = cut.filter((p) => !ClipperLib.Clipper.Orientation(p));
      const largest = Math.max(0, ...outers.map(area));
      const kept = outers.filter((p) => area(p) >= largest * MIN_FRAGMENT_RATIO);
      fragments += outers.length - kept.length;
      return [...kept, ...holes];
    });

    const holes = cleaned.filter((p) => !ClipperLib.Clipper.Orientation(p)).length;
    console.log(
      `  ${region.name}: 조각 ${cleaned.length - holes}개${holes ? ` (구멍 ${holes})` : ''}${fragments ? `, 잘린 쪼가리 ${fragments}개 제거` : ''}, 꼭짓점 ${cleaned.reduce((n, p) => n + p.length, 0)}개`
    );
    return { name: region.name, d: toPathData(cleaned) };
  });

  const header = [
    '// 대한민국 시·도 경계 SVG 경로',
    '// 데이터 출처: Natural Earth (naturalearthdata.com) — 퍼블릭 도메인',
    '// 투영: x = (경도 - 125.7) * 100, y = (38.65 - 위도) * 124',
    `// 인접 시·도 경계에서 양쪽이 각각 ${GAP} 단위씩 물러나 경계가 띄어져 보임 (해안선·섬은 원본 그대로)`,
    '// 자동 생성 (node scripts/generate-korea-map.js) — 직접 수정하지 말 것',
    '',
    `export const MAP_VIEWBOX = '${VIEWBOX}';`,
    '',
    'export const KOREA_REGIONS = [',
  ].join('\n');

  const body = regions
    .map((r) => `  {\n    name: "${r.name}",\n    d: "${r.d}"\n  }`)
    .join(',\n');

  fs.writeFileSync(OUTPUT_FILE, `${header}\n${body}\n];\n`, 'utf8');
  console.log(`완료: ${regions.length}개 시·도 → ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

generate();
