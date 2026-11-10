// Lab 실험작 '유리 로고'의 three.js 씬
// - LogoGlass3D.js가 브라우저에서 three.js를 불러온 뒤 createLogoGlassScene()을 호출한다
// - 로고 마크의 면을 벽으로 세운 3D 모델. 정해진 시점(방위 45°, 고도 35.26°)에서 원본 로고와 겹친다
// - 연출 2종: color(그라데이션 유리), brand(테마색 유리). 둘 다 마우스를 따라오는 조명이 있다

/* ---------- 로고 도면 → 3D ----------
   로고는 아이소메트릭 도면이다. 로고 좌표 (x, y, z)는 2D 도면에서
     sx = CX + K (x - y),  sy = (x + y) / 2 - z + H
   에 놓인다. (x: 오른쪽 아래, y: 왼쪽 아래, z: 위) */
const K = Math.sqrt(3) / 2;
const CX = 27.51;
const H = 22.74;
const L = 31.7;

const onX = (p, X) => { const y = X - (p[0] - CX) / K; return [X, y, 0.5 * (X + y) - p[1] + H]; };
const onY = (p, Y) => { const x = Y + (p[0] - CX) / K; return [x, Y, 0.5 * (x + Y) - p[1] + H]; };
const onZ = (p, Z) => { const d = (p[0] - CX) / K; const s = 2 * (p[1] - H + Z); return [(s + d) / 2, (s - d) / 2, Z]; };
const toThree = (v) => [v[0], v[2], v[1]]; // three: X = 로고 x, Y = 로고 z, Z = 로고 y
const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];

// 원본 로고(public/images/logo/LogoAsset.svg)의 2D 좌표
// a·b·c: 두꺼운 벽 세 개의 윗면 윤곽, d: 뒷벽·오른쪽 벽, WALL_1: 왼쪽 벽
const WALL_1 = [[27.51, 33.53], [0.05, 17.68], [0.05, 38.58], [27.51, 54.44]];
const ART = {
  a: [[27.42, 0], [0.05, 15.8], [29.13, 32.6], [33.27, 31.72], [12.76, 19.88], [27.42, 11.25]],
  b: [[15.98, 19.87], [34.89, 30.78], [37.24, 30.02], [21.85, 21.13], [27.42, 17.91], [27.42, 13.13]],
  c: [[25.08, 21.13], [38.86, 29.09], [42.03, 27.54], [28, 19.44]],
  d: [[29.04, 0.84], [43.65, 26.61], [43.65, 45.12], [54.97, 38.58], [54.97, 15.8]],
};

// 평면 { n: 법선, c: n · p } (로고 좌표)
const planeFrom = (p, q, dir) => {
  const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
  const n = [u[1] * dir[2] - u[2] * dir[1], u[2] * dir[0] - u[0] * dir[2], u[0] * dir[1] - u[1] * dir[0]];
  return { n, c: n[0] * p[0] + n[1] * p[1] + n[2] * p[2] };
};
// 2D 점 p2로 보이는 평면 위의 점
const onPlane = (p2, pl) => {
  const o = onZ(p2, 0);
  const t = (pl.c - (pl.n[0] * o[0] + pl.n[1] * o[1] + pl.n[2] * o[2])) / (pl.n[0] + pl.n[1] + pl.n[2]);
  return [o[0] + t, o[1] + t, o[2] + t];
};

// 모델을 유리판(pane) 목록으로 만든다. 각 판은 사각형 하나.
//   flat: 윗면 여부, tone: 그라데이션 시작 위치, pts: three 좌표 네 점 (세운 판은 위 둘 → 아래 둘 순서)
const buildPanes = () => {
  const panes = [];

  // 바닥까지 닿는 두꺼운 벽. 끝면은 오른쪽 벽 평면(x = L)에 놓인다.
  //   pts: 윗면 2D 윤곽, end: pts[end]·pts[end + 1]이 끝면의 위쪽 두 모서리
  //   band: 끝면으로 이어지는 긴 띠의 인덱스, arm: 모서리를 돌아가는 부분의 인덱스(없으면 null)
  // 띠의 윗면은 끝면 위쪽 두 모서리를 지나 x 방향으로 뻗는 평면이라, 두 모서리 높이가 다르면 기운다.
  const thickWall = (pts, end, band, arm, tone) => {
    const bandPlane = planeFrom(onX(pts[end], L), onX(pts[end + 1], L), [1, 0, 0]);
    const p3 = pts.map(() => null);
    band.forEach((k) => { p3[k] = onPlane(pts[k], bandPlane); });
    if (arm) {
      const shared = arm.filter((k) => p3[k]);
      const armPlane = planeFrom(p3[shared[0]], p3[shared[1]], [0, 1, 0]);
      arm.forEach((k) => { if (!p3[k]) p3[k] = onPlane(pts[k], armPlane); });
    }
    const top = p3.map(toThree);
    const bottom = top.map((v) => [v[0], 0, v[2]]);
    [band, arm].forEach((quad) => {
      if (quad) panes.push({ flat: true, tone, pts: quad.map((k) => top[k]) });
    });
    top.forEach((_, i) => {
      const j = (i + 1) % top.length;
      panes.push({ flat: false, tone, pts: [top[i], top[j], bottom[j], bottom[i]] });
    });
  };

  // 두께 없이 바닥에 선 얇은 벽. from·to는 바닥의 두 모서리 [x, y]
  const sheet = (from, to, heightFrom, heightTo, tone) => {
    panes.push({
      flat: false,
      tone,
      pts: [
        toThree([from[0], from[1], heightFrom]),
        toThree([to[0], to[1], heightTo]),
        toThree([to[0], to[1], 0]),
        toThree([from[0], from[1], 0]),
      ],
    });
  };

  thickWall(ART.a, 2, [1, 2, 3, 4], [0, 1, 4, 5], 0.08);
  thickWall(ART.b, 1, [0, 1, 2, 3], [0, 3, 4, 5], 0.16);
  thickWall(ART.c, 1, [0, 1, 2, 3], null, 0.26);
  const w = onY(WALL_1[0], L); // 왼쪽 벽의 오른쪽 위 모서리
  sheet([0, L], [w[0], L], w[2], w[2], 0);
  const back = onY(ART.d[0], 0); // 뒷벽의 왼쪽 위 모서리
  const backTop = onY(ART.d[4], 0)[2];
  sheet([back[0], 0], [L, 0], backTop, backTop, 0.2);
  const right = onX(ART.d[1], L); // 오른쪽 벽의 왼쪽 위 모서리. 윗선은 뒷벽 꼭대기 모서리까지 올라간다
  sheet([L, right[1]], [L, 0], right[2], backTop, 0.04);
  return panes;
};

/* ---------- 그리는 순서 ----------
   반투명 판은 먼 것부터 그려야 색이 맞게 섞인다. 판의 중심 거리로만 줄을 세우면 긴 판끼리
   순서가 뒤집혀 회전할 때 모서리 색이 튄다. 그래서 판들을 BSP 트리로 나눠 두고(겹쳐 지나가는
   판은 서로의 평면에서 잘라 둠), 매 프레임 시선 방향으로 트리를 훑어 정확한 순서를 얻는다. */
const BSP_EPS = 0.02;
const planeOfPolygon = (pts) => {
  // 뉴웰 방법: 살짝 휜 사각형에도 안정적인 법선
  const n = [0, 0, 0];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  });
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  n[0] /= len; n[1] /= len; n[2] /= len;
  return { n, d: n[0] * pts[0][0] + n[1] * pts[0][1] + n[2] * pts[0][2] };
};
const buildBsp = (pieces) => {
  if (!pieces.length) return null;
  const node = { plane: planeOfPolygon(pieces[0].pts), pieces: [pieces[0]], front: null, back: null };
  const front = [];
  const back = [];
  const { n, d } = node.plane;
  pieces.slice(1).forEach((piece) => {
    const dist = piece.pts.map((v) => n[0] * v[0] + n[1] * v[1] + n[2] * v[2] - d);
    const min = Math.min(...dist);
    const max = Math.max(...dist);
    if (min >= -BSP_EPS && max <= BSP_EPS) node.pieces.push(piece);
    else if (min >= -BSP_EPS) front.push(piece);
    else if (max <= BSP_EPS) back.push(piece);
    else {
      // 평면을 가로지르는 판은 둘로 자른다
      const f = [];
      const b = [];
      piece.pts.forEach((a, i) => {
        const j = (i + 1) % piece.pts.length;
        const da = dist[i];
        const db = dist[j];
        if (da >= -BSP_EPS) f.push(a);
        if (da <= BSP_EPS) b.push(a);
        if ((da > BSP_EPS && db < -BSP_EPS) || (da < -BSP_EPS && db > BSP_EPS)) {
          const cut = lerp3(a, piece.pts[j], da / (da - db));
          f.push(cut);
          b.push(cut);
        }
      });
      if (f.length >= 3) front.push({ ...piece, pts: f });
      if (b.length >= 3) back.push({ ...piece, pts: b });
    }
  });
  node.front = buildBsp(front);
  node.back = buildBsp(back);
  return node;
};
// 시선 방향 dir(카메라 → 장면)로 볼 때 먼 조각부터 visit을 부른다
const walkBsp = (node, dir, visit) => {
  if (!node) return;
  const facing = node.plane.n[0] * dir.x + node.plane.n[1] * dir.y + node.plane.n[2] * dir.z;
  const near = facing < 0 ? node.front : node.back; // 카메라 쪽 절반
  const far = facing < 0 ? node.back : node.front;
  walkBsp(far, dir, visit);
  node.pieces.forEach(visit);
  walkBsp(near, dir, visit);
};

/* ---------- 연출 ---------- */
// 그라데이션(바닥 → 꼭대기). 셰이더가 5단 고정이라 4단짜리는 마지막 단을 한 번 더 채운다.
// 무대 배경은 페이지 배경색을 그대로 쓰므로(테두리 없이 이어지게), 페이지가 밝을 때와 어두울 때의
// 그라데이션을 따로 둔다. 배경과 같은 밝기의 색은 묻히기 때문.
const COLOR_STOPS = [[0, [255, 138, 42]], [0.28, [255, 92, 92]], [0.5, [255, 61, 154]], [0.74, [150, 96, 255]], [1, [54, 178, 255]]];
const PALETTES = {
  color: { dark: COLOR_STOPS, light: COLOR_STOPS },
  // 사이트 테마색: 크림 #FAF9F6, 베이지 #C2B8A3, 연한 카키 #7A845C, 로고 초록 #54743B, 진한 카키 #28391A
  brand: {
    dark: [[0, [250, 249, 246]], [0.3, [194, 184, 163]], [0.62, [122, 132, 92]], [1, [84, 116, 59]], [1.01, [84, 116, 59]]],
    light: [[0, [40, 57, 26]], [0.38, [84, 116, 59]], [0.7, [122, 132, 92]], [1, [194, 184, 163]], [1.01, [194, 184, 163]]],
  },
};
// bloom(빛 번짐)은 어두운 배경에서만 켠다. 밝은 배경에서는 배경 전체가 번져 버린다.
const LOOKS = {
  color: { side: 0.5, top: 0.42, edge: '#ffffff', edgeOpacity: 0.55, bloom: 0 },
  brand: { side: 0.64, top: 0.56, edge: '#ffffff', edgeOpacity: 0.55, bloom: 0.15 },
};
const STRIPS = 12; // 바닥에 비치는 띠 하나의 높이 = 판 높이의 1/STRIPS
const MIRROR_ALPHA = [0.2, 0.13, 0.08, 0.04]; // 바닥에 비친 아래쪽 띠들의 농도 (바닥에서 멀수록 옅게)

const PANE_VERTEX = /* glsl */ `
  attribute float aT;
  attribute float aMix;
  varying float vT;
  varying float vMix;
  varying vec3 vWorld;
  void main() {
    vT = aT;
    vMix = aMix;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const PANE_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  uniform vec3 uStops[5];
  uniform float uStopPos[5];
  uniform vec3 uLight;
  uniform float uLightPower;
  varying float vT;
  varying float vMix;
  varying vec3 vWorld;
  vec3 palette(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 c = uStops[0];
    for (int i = 1; i < 5; i++) {
      c = mix(c, uStops[i], clamp((t - uStopPos[i - 1]) / max(0.0001, uStopPos[i] - uStopPos[i - 1]), 0.0, 1.0));
    }
    return c;
  }
  void main() {
    // 바닥에 비친 판(y를 뒤집어 그림)도 같은 조명을 받도록 높이는 절댓값으로 본다
    vec3 q = vec3(vWorld.x, abs(vWorld.y), vWorld.z);
    // 색이 천천히 일렁이고, 조명 가까이에서 밝아진다
    float flow = 0.05 * sin(uTime * 0.5 + q.x * 0.12 - q.z * 0.1);
    vec3 c = palette(vT + flow);
    c = vMix > 0.0 ? mix(c, vec3(1.0), vMix) : c * (1.0 + vMix);
    float d = distance(q, uLight);
    float glow = exp(-d * d / 90.0) * uLightPower;
    c += glow * mix(vec3(1.0), c, 0.5) * 0.3;
    float alpha = min(1.0, uOpacity * (1.0 + glow * 0.2));
    gl_FragColor = vec4(c, alpha);
  }
`;

// 바닥에 번지는 빛
const FLOOR_VERTEX = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const FLOOR_FRAGMENT = /* glsl */ `
  uniform vec2 uCenter;
  uniform vec3 uLight;
  uniform float uLightPower;
  uniform vec3 uPool;
  uniform vec3 uSpot;
  varying vec3 vWorld;
  void main() {
    vec2 a = vWorld.xz - uCenter;
    vec2 b = vWorld.xz - uLight.xz;
    float pool = exp(-dot(a, a) / 900.0) * 0.1;
    float spot = exp(-dot(b, b) / 110.0) * 0.22 * uLightPower;
    gl_FragColor = vec4(uPool * pool + uSpot * spot, 1.0);
  }
`;

export function createLogoGlassScene({ THREE, EffectComposer, RenderPass, UnrealBloomPass, stage, canvas }) {
  // 셰이더가 내보내는 색을 그대로 화면에 쓴다 (three의 색 공간 변환을 거치지 않음)
  THREE.ColorManagement.enabled = false;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-30, 30, 30, -38, 1, 500);
  const target = new THREE.Vector3(L / 2, H / 2, L / 2);
  const disposables = [];
  const keep = (thing) => { disposables.push(thing); return thing; };

  const shared = {
    uTime: { value: 0 },
    uLight: { value: new THREE.Vector3(L / 2, 9, L / 2) },
    uLightPower: { value: 1 },
  };
  const viewDir = new THREE.Vector3(0, 0, -1);

  /* ----- 유리판 지오메트리 (연출끼리 공유) ----- */
  const mirrorBuffers = MIRROR_ALPHA.map(() => ({ pos: [], t: [], mix: [] }));
  const edgePositions = [];
  const geometryOf = (buf) => {
    const geo = keep(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.Float32BufferAttribute(buf.pos, 3));
    geo.setAttribute('aT', new THREE.Float32BufferAttribute(buf.t, 1));
    geo.setAttribute('aMix', new THREE.Float32BufferAttribute(buf.mix, 1));
    return geo;
  };
  // 그라데이션 위치는 좌표의 1차식이라 잘린 조각의 새 꼭짓점에서도 그대로 계산된다
  const pushVertex = (into, v, tone, mix) => {
    into.pos.push(v[0], v[1], v[2]);
    into.t.push((v[1] / 23) * 0.72 + tone + (0.05 * (v[0] - v[2])) / L);
    into.mix.push(mix);
  };
  const panes = buildPanes().map((pane) => {
    const p = pane.pts;
    // x 방향을 보는 판은 조금 어둡게, 윗면은 조금 밝게 해서 형태가 읽히게 한다
    const alongX = Math.abs(p[1][2] - p[0][2]) > Math.abs(p[1][0] - p[0][0]);
    const mix = pane.flat ? 0.3 : alongX ? -0.14 : 0;
    if (!pane.flat) {
      // 바닥에 비칠 아래쪽 띠들 (바닥에 닿는 띠가 0번)
      for (let band = 0; band < mirrorBuffers.length; band++) {
        const lo = 1 - band / STRIPS;
        const hi = 1 - (band + 1) / STRIPS;
        const a = lerp3(p[0], p[3], hi);
        const b = lerp3(p[1], p[2], hi);
        const c = lerp3(p[1], p[2], lo);
        const d = lerp3(p[0], p[3], lo);
        [a, b, c, a, c, d].forEach((v) => pushVertex(mirrorBuffers[band], v, pane.tone, mix));
      }
    }
    for (let i = 0; i < 4; i++) edgePositions.push(...p[i], ...p[(i + 1) % 4]);
    return { pts: p, flat: pane.flat, tone: pane.tone, mix };
  });
  // 판을 BSP 조각으로 나누고, 조각마다 지오메트리를 만든다
  const bsp = buildBsp(panes);
  const pieces = [];
  walkBsp(bsp, { x: 0, y: 0, z: 1 }, (piece) => {
    const buf = { pos: [], t: [], mix: [] };
    for (let i = 1; i < piece.pts.length - 1; i++) {
      [piece.pts[0], piece.pts[i], piece.pts[i + 1]].forEach((v) => pushVertex(buf, v, piece.tone, piece.mix));
    }
    piece.geometry = geometryOf(buf);
    piece.index = pieces.length;
    pieces.push(piece);
  });
  const mirrorGeometries = mirrorBuffers.map(geometryOf);
  const edgeGeometry = keep(new THREE.BufferGeometry());
  edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));

  /* ----- 연출별 그룹 ----- */
  const lookMaterials = {}; // 연출별 유리판 머티리얼 (테마가 바뀌면 그라데이션을 다시 채운다)
  const paneMaterial = (name, opacity) => {
    const material = keep(new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: opacity },
        uStops: { value: [0, 1, 2, 3, 4].map(() => new THREE.Vector3()) },
        uStopPos: { value: [0, 0.25, 0.5, 0.75, 1] },
        uTime: shared.uTime,
        uLight: shared.uLight,
        uLightPower: shared.uLightPower,
      },
      vertexShader: PANE_VERTEX,
      fragmentShader: PANE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }));
    (lookMaterials[name] = lookMaterials[name] || []).push(material);
    return material;
  };
  const groups = {};
  Object.keys(LOOKS).forEach((name) => {
    const look = LOOKS[name];
    const group = new THREE.Group();
    const side = paneMaterial(name, look.side);
    const top = paneMaterial(name, look.top);
    group.userData.faces = pieces.map((piece) => {
      const mesh = new THREE.Mesh(piece.geometry, piece.flat ? top : side);
      group.add(mesh);
      return mesh;
    });
    // 아래쪽 띠를 바닥 밑으로 뒤집어 그려서 반들거리는 바닥에 비친 것처럼 보이게 한다
    mirrorGeometries.forEach((geo, band) => {
      const mesh = new THREE.Mesh(geo, paneMaterial(name, MIRROR_ALPHA[band]));
      mesh.scale.y = -1;
      mesh.renderOrder = -1e6;
      group.add(mesh);
    });
    const lines = new THREE.LineSegments(
      edgeGeometry,
      keep(new THREE.LineBasicMaterial({ color: look.edge, transparent: true, opacity: look.edgeOpacity, depthWrite: false }))
    );
    lines.renderOrder = 1e6;
    group.add(lines);
    group.visible = false;
    scene.add(group);
    groups[name] = group;
  });

  /* ----- 바닥 빛 ----- */
  const floorUniforms = {
    uCenter: { value: new THREE.Vector2(L / 2, L / 2) },
    uLight: shared.uLight,
    uLightPower: shared.uLightPower,
    uPool: { value: new THREE.Vector3() },
    uSpot: { value: new THREE.Vector3() },
  };
  const floorGlow = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(220, 220)),
    keep(new THREE.ShaderMaterial({
      uniforms: floorUniforms,
      vertexShader: FLOOR_VERTEX,
      fragmentShader: FLOOR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }))
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.set(L / 2, 0.01, L / 2);
  floorGlow.renderOrder = -2e6;
  scene.add(floorGlow);

  /* ----- 빛 번짐(블룸) ----- */
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.5, 0.82);
  composer.addPass(bloom);

  /* ----- 테마와 연출 ----- */
  // 무대 배경 = 페이지 배경(--light-color). 사이트는 OS의 라이트/다크 설정을 따라 바뀐다.
  let lookName = 'color';
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = () => {
    const dark = darkQuery.matches;
    const theme = dark ? 'dark' : 'light';
    const page = getComputedStyle(document.documentElement).getPropertyValue('--light-color').trim();
    scene.background = new THREE.Color(page || (dark ? '#15180F' : '#FAF9F6'));
    Object.keys(LOOKS).forEach((name) => {
      const stops = PALETTES[name][theme];
      lookMaterials[name].forEach((material) => {
        stops.forEach((stop, i) => {
          material.uniforms.uStops.value[i].set(stop[1][0] / 255, stop[1][1] / 255, stop[1][2] / 255);
          material.uniforms.uStopPos.value[i] = stop[0];
        });
      });
    });
    // 바닥에 번지는 빛과 빛 번짐은 더하는 방식이라 어두운 배경에서만 보인다
    const floor = PALETTES[lookName][theme][0][1];
    floorUniforms.uPool.value.set(floor[0] / 255, floor[1] / 255, floor[2] / 255);
    floorUniforms.uSpot.value.set(1, 0.92, 0.82);
    floorGlow.visible = dark;
    bloom.enabled = dark && LOOKS[lookName].bloom > 0;
    bloom.strength = LOOKS[lookName].bloom;
  };
  const setLook = (name) => {
    if (!LOOKS[name]) return;
    lookName = name;
    Object.keys(groups).forEach((key) => { groups[key].visible = key === name; });
    applyTheme();
  };
  darkQuery.addEventListener('change', applyTheme);

  /* ----- 크기 ----- */
  // 화면 중심(모델 중심) 위아래로 보여 줄 범위. 아래쪽은 바닥 반사가 있어 조금 더 둔다
  const TOP = 31;
  const BOTTOM = 33;
  const MIN_HALF_W = 30;
  let ready = false;
  const resize = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    let span = TOP + BOTTOM;
    let halfW = (span * (width / height)) / 2;
    if (halfW < MIN_HALF_W) { halfW = MIN_HALF_W; span = (2 * halfW * height) / width; }
    const top = (span * TOP) / (TOP + BOTTOM);
    camera.left = -halfW;
    camera.right = halfW;
    camera.top = top;
    camera.bottom = top - span;
    camera.updateProjectionMatrix();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    composer.setPixelRatio(ratio);
    composer.setSize(width, height);
    if (ready) draw();
  };

  /* ----- 카메라와 조명의 움직임 ----- */
  const AZ0 = Math.PI / 4; // 로고 시점
  const EL0 = Math.atan(Math.SQRT1_2);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let az = AZ0;
  let el = EL0;
  let phi = 0;
  let hold = 0;
  let tween = null;
  let autoOn = !reduced;
  let dragging = false;
  let time = 0;
  const pointer = { x: 0, y: 0, until: 0 }; // 캔버스 위 마우스 위치 (-1 ~ 1)와 유효 시각
  const lightGoal = new THREE.Vector3();
  const scratch = new THREE.Vector3();

  const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const shape = (s) => (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), 1.7);
  const goHome = (duration = 0.9) => { tween = { az: AZ0 + wrap(az - AZ0), el, t: 0, dur: duration }; };
  // 직접 돌리면 자동 회전을 멈추고, '로고 시점'으로 돌아가면 다시 시작한다
  const stopAuto = () => { autoOn = false; };
  const returnHome = () => {
    goHome();
    autoOn = !reduced;
  };

  if (!reduced) { az = AZ0 - 1.15; el = 0.36; goHome(2.6); }

  const placeCamera = () => {
    const ce = Math.cos(el);
    camera.position.set(target.x + 160 * ce * Math.sin(az), target.y + 160 * Math.sin(el), target.z + 160 * ce * Math.cos(az));
    camera.lookAt(target);
    camera.updateMatrixWorld();
    camera.getWorldDirection(viewDir);
  };

  const step = (dt, now) => {
    if (!reduced) time += dt;
    shared.uTime.value = time;

    if (!dragging) {
      if (tween) {
        tween.t = Math.min(1, tween.t + dt / tween.dur);
        const e = 1 - Math.pow(1 - tween.t, 3);
        az = tween.az + (AZ0 - tween.az) * e;
        el = tween.el + (EL0 - tween.el) * e;
        if (tween.t >= 1) { tween = null; az = AZ0; el = EL0; phi = 0; hold = 1.6; }
      } else if (autoOn) {
        if (hold > 0) hold -= dt;
        else {
          phi += dt * ((2 * Math.PI) / 18);
          const s = shape(Math.sin(phi));
          az = AZ0 + 0.72 * s;
          el = EL0 - 0.13 * s * s;
        }
      }
    }
    placeCamera();

    // 마우스가 캔버스 위에 있으면 조명이 마우스를 따라오고, 없으면 혼자 천천히 돈다
    const follow = now < pointer.until && !dragging;
    lightGoal.set(L / 2 + 12 * Math.cos(time * 0.45), 9 + 3.5 * Math.sin(time * 0.8), L / 2 + 12 * Math.sin(time * 0.45));
    if (follow) {
      // 마우스가 가리키는 지점: 화면 광선이 높이 9의 수평면과 만나는 곳
      const dir = viewDir;
      scratch.set(pointer.x, pointer.y, -1).unproject(camera);
      if (Math.abs(dir.y) > 0.05) {
        scratch.addScaledVector(dir, (9 - scratch.y) / dir.y);
        const dx = scratch.x - L / 2;
        const dz = scratch.z - L / 2;
        const far = Math.hypot(dx, dz);
        const limit = far > 28 ? 28 / far : 1;
        lightGoal.set(L / 2 + dx * limit, 9, L / 2 + dz * limit);
      }
    }
    const ease = 1 - Math.exp(-dt * 5);
    shared.uLight.value.lerp(lightGoal, ease);
  };

  function draw() {
    // 반투명 판은 먼 것부터 그려야 하므로 BSP 트리를 시선 방향으로 훑어 순서를 매긴다
    const faces = groups[lookName].userData.faces;
    let order = 0;
    walkBsp(bsp, viewDir, (piece) => { faces[piece.index].renderOrder = order++; });
    composer.render();
  }

  let onScreen = true;
  let rafId = 0;
  let last = performance.now();
  const frame = (now) => {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!onScreen || document.hidden) return; // 화면 밖이면 쉰다
    step(dt, now);
    draw();
  };

  /* ----- 입력 ----- */
  let px = 0;
  let py = 0;
  const trackPointer = (ev) => {
    if (ev.pointerType && ev.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -(((ev.clientY - r.top) / r.height) * 2 - 1);
    pointer.until = performance.now() + 2500;
  };
  const onPointerDown = (ev) => {
    dragging = true;
    tween = null;
    stopAuto();
    px = ev.clientX;
    py = ev.clientY;
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* 캡처를 못 해도 드래그는 동작 */ }
  };
  const onPointerMove = (ev) => {
    if (!dragging) { trackPointer(ev); return; }
    az -= (ev.clientX - px) * 0.0085;
    el = Math.max(0.06, Math.min(1.45, el + (ev.clientY - py) * 0.006));
    px = ev.clientX;
    py = ev.clientY;
  };
  const endDrag = () => { dragging = false; };
  const onPointerLeave = () => { pointer.until = 0; };
  const onKeyDown = (ev) => {
    if (ev.key === 'ArrowLeft') az += 0.08;
    else if (ev.key === 'ArrowRight') az -= 0.08;
    else if (ev.key === 'ArrowUp') el = Math.min(1.45, el + 0.06);
    else if (ev.key === 'ArrowDown') el = Math.max(0.06, el - 0.06);
    else return;
    ev.preventDefault();
    tween = null;
    stopAuto();
  };
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('keydown', onKeyDown);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const viewObserver = new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; });
  viewObserver.observe(stage);

  setLook(lookName);
  resize();
  placeCamera();
  ready = true;
  rafId = requestAnimationFrame(frame);

  return {
    setLook,
    goHome: returnHome,
    dispose() {
      cancelAnimationFrame(rafId);
      darkQuery.removeEventListener('change', applyTheme);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', endDrag);
      canvas.removeEventListener('pointercancel', endDrag);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('keydown', onKeyDown);
      disposables.forEach((thing) => thing.dispose());
      composer.dispose();
      renderer.dispose();
    },
  };
}
