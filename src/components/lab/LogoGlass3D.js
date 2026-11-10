import { useEffect, useRef, useState } from 'react';

// Lab 실험작 '유리 로고'
// - 로고 마크를 3D 유리 건물로 세운 모델 (씬 코드는 logoGlassScene.js)
// - three.js는 이 컴포넌트가 화면에 올라온 뒤에만 불러온다 → 다른 페이지 번들에는 포함되지 않음
// - 연출을 추가하려면 logoGlassScene.js의 LOOKS와 아래 LOOK_BUTTONS에 같은 이름으로 넣는다
const LOOK_BUTTONS = [
  { name: 'color', label: '컬러' },
  { name: 'brand', label: '브랜드' },
];

const LogoGlass3D = () => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const lookRef = useRef('color');
  const [look, setLook] = useState('color');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let scene = null;

    Promise.all([
      import('three'),
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('./logoGlassScene'),
    ])
      .then(([THREE, composer, renderPass, bloomPass, sceneModule]) => {
        if (cancelled) return;
        scene = sceneModule.createLogoGlassScene({
          THREE,
          EffectComposer: composer.EffectComposer,
          RenderPass: renderPass.RenderPass,
          UnrealBloomPass: bloomPass.UnrealBloomPass,
          stage: stageRef.current,
          canvas: canvasRef.current,
        });
        scene.setLook(lookRef.current);
        sceneRef.current = scene;
      })
      .catch(() => {
        if (!cancelled) setFailed(true); // WebGL을 쓸 수 없는 환경 → 평면 로고로 대체
      });

    return () => {
      cancelled = true;
      if (scene) scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const chooseLook = (name) => {
    lookRef.current = name;
    setLook(name);
    if (sceneRef.current) sceneRef.current.setLook(name);
  };

  return (
    <div className="lab-piece">
      <div className={`lab-stage lab-stage-${look}`} ref={stageRef}>
        <canvas
          ref={canvasRef}
          className="lab-canvas"
          tabIndex={0}
          aria-label="PTAHLABS 로고 3D 모델. 드래그하거나 방향키로 돌릴 수 있습니다."
        />
        {failed && (
          <div className="lab-fallback">
            <img src="/images/logo/LogoAsset.svg" alt="PTAHLABS 로고" />
            <p>이 브라우저에서는 3D를 표시할 수 없어 평면 로고를 보여드립니다.</p>
          </div>
        )}
      </div>

      <div className="lab-controls">
        <div className="lab-toggle" role="group" aria-label="연출">
          {LOOK_BUTTONS.map((b) => (
            <button
              key={b.name}
              type="button"
              className="lab-chip"
              aria-pressed={look === b.name}
              onClick={() => chooseLook(b.name)}
            >
              {b.label}
            </button>
          ))}
        </div>
        <button type="button" className="lab-chip" onClick={() => sceneRef.current && sceneRef.current.goHome()}>
          로고 시점
        </button>
      </div>
    </div>
  );
};

export default LogoGlass3D;
