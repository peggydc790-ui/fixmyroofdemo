import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  hipRoofGeometry,
  hipRoofPoints,
  hipRoofTileMatrices,
  mulberry32,
  tileGeometry,
  type HipRoofSpec,
} from "./roof-geometry";

/* ---------------- Tunables ---------------- */
const UPPER = { w: 10, d: 7, y0: 3.05, h: 2.85 };
const EAVE_Y = UPPER.y0 + UPPER.h;
const OVERHANG = 0.95;
const ROOF: HipRoofSpec = {
  width: UPPER.w + OVERHANG * 2,
  depth: UPPER.d + OVERHANG * 2,
  eaveY: EAVE_Y,
  pitch: THREE.MathUtils.degToRad(24),
};
const TILE_W = 0.34;
const TILE_LEN = 0.42;
const ROW_STEP = 0.31;

const C = {
  tile: "#3a3a3c",
  cap: "#2f2f31",
  render: "#ece6dc",
  lower: "#2a2928",
  slab: "#b9b2a6",
  timber: "#8a5a36",
  soffit: "#a87a52",
  glass: "#1b1d20",
  glow: "#ffc48a",
  fascia: "#232323",
  lawn: "#3d4a2c",
  concrete: "#8f8a82",
};

export type HouseSceneProps = {
  progressRef: { current: number };
  reducedMotion: boolean;
  compact: boolean;
  active: boolean;
  onReady: () => void;
};

export default function HouseScene({
  progressRef,
  reducedMotion,
  compact,
  active,
  onReady,
}: HouseSceneProps) {
  return (
    <Canvas
      shadows
      dpr={compact ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: compact ? 50 : 34, near: 0.1, far: 400, position: [24, 22, 32] }}
      aria-hidden
    >
      <fog attach="fog" args={["#2a2420", 38, 120]} />
      <SkyDome />
      <Lights compact={compact} />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={2.2} color="#ffb980" position={[-10, 4, 6]} scale={[20, 5, 1]} />
        <Lightformer intensity={0.8} color="#9fb1c4" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[30, 30, 1]} />
        <Lightformer intensity={0.6} color="#d9c3a8" position={[10, 2, -6]} rotation-y={-Math.PI / 2} scale={[20, 3, 1]} />
      </Environment>

      <Ground />
      <House />
      <Roof compact={compact} />
      <Neighbourhood />
      <Landscape />

      {!reducedMotion && (
        <Sparkles count={compact ? 40 : 80} scale={[34, 10, 34]} position={[0, 6, 0]} size={2.2} speed={0.18} opacity={0.5} color="#ffd2a1" />
      )}

      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} onReady={onReady} />
    </Canvas>
  );
}

/* ---------------- Camera ---------------- */

const POS_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(17, 15, 22),
  new THREE.Vector3(12.5, 11.5, 14.5),
  new THREE.Vector3(4.6, 7.9, 7.4),
]);
const TARGET_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 3.6, 0),
  new THREE.Vector3(0.6, 5.2, 0.8),
  new THREE.Vector3(0.9, 6.75, 2.1),
]);
const INTRO_FROM = new THREE.Vector3(30, 26, 38);

function CameraRig({
  progressRef,
  reducedMotion,
  onReady,
}: {
  progressRef: { current: number };
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const { camera, size } = useThree();
  const state = useRef({ p: 0, intro: reducedMotion ? 1 : 0, frames: 0, ready: false });
  const pos = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(0, 3.6, 0), []);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = size.width / size.height < 1 ? 52 : 34;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((s, delta) => {
    const dt = Math.min(delta, 0.05);
    const st = state.current;
    st.p = THREE.MathUtils.damp(st.p, progressRef.current, 4, dt);
    if (st.intro < 1) st.intro = Math.min(1, st.intro + dt / 3.4);
    const ease = 1 - Math.pow(1 - st.intro, 3);

    const p = THREE.MathUtils.clamp(st.p, 0, 1);
    POS_PATH.getPoint(p, pos);
    TARGET_PATH.getPoint(p, target);

    // Subtle handheld "breathing" for atmosphere.
    if (!reducedMotion) {
      const t = s.clock.elapsedTime;
      pos.x += Math.sin(t * 0.21) * 0.35 * (1 - p * 0.7);
      pos.y += Math.sin(t * 0.17) * 0.18;
    }
    pos.lerpVectors(INTRO_FROM, pos, ease);
    camera.position.copy(pos);
    lookAt.lerp(target, 1 - Math.exp(-6 * dt));
    camera.lookAt(lookAt);

    if (!st.ready && ++st.frames > 2) {
      st.ready = true;
      onReady();
    }
  });
  return null;
}

/* ---------------- Environment ---------------- */

function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          top: { value: new THREE.Color("#0f1216") },
          mid: { value: new THREE.Color("#3b3540") },
          horizon: { value: new THREE.Color("#d9905a") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 top; uniform vec3 mid; uniform vec3 horizon;
          varying vec3 vPos;
          void main() {
            float h = clamp(vPos.y, -1.0, 1.0);
            float a = smoothstep(-0.05, 0.18, h);
            float b = smoothstep(0.12, 0.7, h);
            vec3 col = mix(horizon, mid, a);
            col = mix(col, top, b);
            // warm sun bloom low in the west
            vec3 sunDir = normalize(vec3(-0.75, 0.12, 0.45));
            float sun = max(dot(vPos, sunDir), 0.0);
            col += vec3(1.0, 0.62, 0.32) * (sun * sun * sun * sun * sun * sun * 0.55);
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  );
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[200, 32, 16]} />
    </mesh>
  );
}

function Lights({ compact }: { compact: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const l = sun.current;
    if (!l) return;
    const cam = l.shadow.camera as THREE.OrthographicCamera;
    cam.left = -18;
    cam.right = 18;
    cam.top = 18;
    cam.bottom = -18;
    cam.near = 1;
    cam.far = 90;
    cam.updateProjectionMatrix();
    l.shadow.bias = -0.0004;
    l.shadow.normalBias = 0.03;
  }, []);
  return (
    <>
      <hemisphereLight args={["#9fb3c8", "#3a2a1f", 0.55]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        ref={sun}
        position={[-26, 13, 16]}
        intensity={3.4}
        color="#ffb27a"
        castShadow
        shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
      />
      <directionalLight position={[14, 10, -12]} intensity={0.35} color="#8ea4bd" />
    </>
  );
}

function useGrassTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = C.lawn;
    ctx.fillRect(0, 0, 256, 256);
    const rnd = mulberry32(7);
    for (let i = 0; i < 5000; i++) {
      const v = rnd();
      ctx.fillStyle = v > 0.5 ? "rgba(90,110,60,0.35)" : "rgba(25,32,18,0.35)";
      ctx.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 3);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(40, 40);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);
}

function Ground() {
  const grass = useGrassTexture();
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial map={grass} roughness={1} />
      </mesh>
      {/* Driveway */}
      <mesh rotation-x={-Math.PI / 2} position={[2.4, 0.01, 9]} receiveShadow>
        <planeGeometry args={[4.2, 11]} />
        <meshStandardMaterial color={C.concrete} roughness={0.9} />
      </mesh>
      {/* Street */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.008, 16.5]} receiveShadow>
        <planeGeometry args={[260, 7]} />
        <meshStandardMaterial color="#2d2c2b" roughness={0.95} />
      </mesh>
      {/* Pool + coping */}
      <mesh rotation-x={-Math.PI / 2} position={[-9.5, 0.015, -1]} receiveShadow>
        <planeGeometry args={[4.6, 9.4]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.8} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-9.5, 0.03, -1]}>
        <planeGeometry args={[3.6, 8.4]} />
        <meshStandardMaterial color="#3f8f9a" roughness={0.05} metalness={0.2} envMapIntensity={1.6} />
      </mesh>
    </group>
  );
}

/* ---------------- House ---------------- */

function House() {
  const battens = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 22; i++) arr.push([1.4 + i * 0.16, UPPER.y0 + UPPER.h / 2, UPPER.d / 2 + 0.08]);
    return arr;
  }, []);

  return (
    <group>
      {/* Lower level (recessed, dark) */}
      <mesh position={[0.2, 1.4, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 2.8, 6.4]} />
        <meshStandardMaterial color={C.lower} roughness={0.85} />
      </mesh>
      {/* Garage door */}
      <mesh position={[2.4, 1.15, 3.01]}>
        <boxGeometry args={[3.4, 2.3, 0.05]} />
        <meshStandardMaterial color="#3a3836" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Entry glass + timber door */}
      <mesh position={[-1.6, 1.25, 3.01]}>
        <boxGeometry args={[2.6, 2.3, 0.05]} />
        <meshStandardMaterial color={C.glass} emissive={C.glow} emissiveIntensity={0.55} roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[-3.5, 1.2, 3.02]}>
        <boxGeometry args={[0.95, 2.3, 0.06]} />
        <meshStandardMaterial color={C.timber} roughness={0.6} />
      </mesh>

      {/* Floor slab (cantilever) */}
      <mesh position={[0, UPPER.y0 - 0.13, 0]} castShadow receiveShadow>
        <boxGeometry args={[UPPER.w + 0.5, 0.26, UPPER.d + 0.5]} />
        <meshStandardMaterial color={C.slab} roughness={0.8} />
      </mesh>

      {/* Upper level */}
      <mesh position={[0, UPPER.y0 + UPPER.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[UPPER.w, UPPER.h, UPPER.d]} />
        <meshStandardMaterial color={C.render} roughness={0.92} />
      </mesh>
      {/* Front glazing band */}
      <mesh position={[-1.6, UPPER.y0 + 1.35, UPPER.d / 2 + 0.01]}>
        <boxGeometry args={[5.4, 2.1, 0.04]} />
        <meshStandardMaterial color={C.glass} emissive={C.glow} emissiveIntensity={0.9} roughness={0.08} metalness={0.5} />
      </mesh>
      {[-3.4, -1.6, 0.2].map((x) => (
        <mesh key={x} position={[x, UPPER.y0 + 1.35, UPPER.d / 2 + 0.04]}>
          <boxGeometry args={[0.07, 2.12, 0.05]} />
          <meshStandardMaterial color={C.fascia} />
        </mesh>
      ))}
      {/* Timber batten screen */}
      {battens.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.07, UPPER.h - 0.2, 0.12]} />
          <meshStandardMaterial color={C.timber} roughness={0.55} />
        </mesh>
      ))}
      {/* Side windows */}
      {[-2.2, 1.6].map((z) => (
        <mesh key={z} position={[UPPER.w / 2 + 0.01, UPPER.y0 + 1.45, z]}>
          <boxGeometry args={[0.04, 1.5, 2]} />
          <meshStandardMaterial color={C.glass} emissive={C.glow} emissiveIntensity={0.6} roughness={0.1} metalness={0.5} />
        </mesh>
      ))}
      {[-2.4, 1.2].map((z) => (
        <mesh key={`l${z}`} position={[-UPPER.w / 2 - 0.01, UPPER.y0 + 1.45, z]}>
          <boxGeometry args={[0.04, 1.5, 2.4]} />
          <meshStandardMaterial color={C.glass} emissive={C.glow} emissiveIntensity={0.7} roughness={0.1} metalness={0.5} />
        </mesh>
      ))}
      {/* Soffit */}
      <mesh position={[0, EAVE_Y - 0.02, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[ROOF.width - 0.05, ROOF.depth - 0.05]} />
        <meshStandardMaterial color={C.soffit} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Warm downlights under the eave */}
      <pointLight position={[-1.6, EAVE_Y - 0.4, UPPER.d / 2 + 0.6]} intensity={4} distance={6} color={C.glow} />
    </group>
  );
}

function Roof({ compact }: { compact: boolean }) {
  const tilesRef = useRef<THREE.InstancedMesh>(null);
  const { matrices, tileGeo, underlay, caps } = useMemo(() => {
    const matrices = hipRoofTileMatrices(ROOF, TILE_W, ROW_STEP, TILE_LEN);
    const tileGeo = tileGeometry(TILE_W * 0.985, TILE_LEN, compact ? 6 : 9);
    const underlay = hipRoofGeometry(ROOF);
    const pts = hipRoofPoints(ROOF);
    const lift = new THREE.Vector3(0, 0.07, 0);
    const caps: { from: THREE.Vector3; to: THREE.Vector3 }[] = [
      { from: pts.R1, to: pts.R2 },
      { from: pts.E1, to: pts.R1 },
      { from: pts.E2, to: pts.R2 },
      { from: pts.E3, to: pts.R2 },
      { from: pts.E4, to: pts.R1 },
    ].map((c) => ({ from: c.from.clone().add(lift), to: c.to.clone().add(lift) }));
    return { matrices, tileGeo, underlay, caps };
  }, [compact]);

  useLayoutEffect(() => {
    const mesh = tilesRef.current;
    if (!mesh) return;
    const rnd = mulberry32(42);
    const base = new THREE.Color(C.tile);
    const col = new THREE.Color();
    matrices.forEach((m, i) => {
      mesh.setMatrixAt(i, m);
      const v = 0.86 + rnd() * 0.24;
      col.copy(base).multiplyScalar(v);
      mesh.setColorAt(i, col);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices]);

  const { hw, hd } = hipRoofPoints(ROOF);

  return (
    <group>
      <mesh geometry={underlay} castShadow receiveShadow>
        <meshStandardMaterial color="#1e1e1f" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={tilesRef} args={[tileGeo, undefined, matrices.length]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.62} metalness={0.05} envMapIntensity={0.9} />
      </instancedMesh>
      {caps.map((c, i) => (
        <CapLine key={i} from={c.from} to={c.to} />
      ))}
      {/* Fascia + gutters */}
      {[
        { p: [0, EAVE_Y - 0.08, hd] as const, s: [ROOF.width + 0.06, 0.22, 0.06] as const },
        { p: [0, EAVE_Y - 0.08, -hd] as const, s: [ROOF.width + 0.06, 0.22, 0.06] as const },
        { p: [hw, EAVE_Y - 0.08, 0] as const, s: [0.06, 0.22, ROOF.depth + 0.06] as const },
        { p: [-hw, EAVE_Y - 0.08, 0] as const, s: [0.06, 0.22, ROOF.depth + 0.06] as const },
      ].map((f, i) => (
        <mesh key={i} position={f.p as unknown as [number, number, number]} castShadow>
          <boxGeometry args={f.s as unknown as [number, number, number]} />
          <meshStandardMaterial color={C.fascia} roughness={0.35} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CapLine({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    const position = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    return { position, quaternion, length };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[0.13, 0.13, length, 14, 1, false]} />
      <meshStandardMaterial color={C.cap} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

/* ---------------- Context ---------------- */

function Neighbourhood() {
  const homes = useMemo(() => {
    const rnd = mulberry32(99);
    const list: { x: number; z: number; w: number; d: number; h: number; roof: string; wall: string; rot: number }[] = [];
    const slots: [number, number][] = [
      [-24, 0], [24, -2], [-22, -22], [4, -24], [26, -24], [-6, 30], [20, 30], [-30, 30], [40, 8], [-42, 6], [40, 32], [-40, -26],
    ];
    for (const [x, z] of slots) {
      const w = 8 + rnd() * 4;
      list.push({
        x, z, w, d: w * (0.62 + rnd() * 0.2), h: 2.8 + rnd() * 2.6,
        roof: ["#3b3d40", "#5a4034", "#4b4e52", "#2f3134"][Math.floor(rnd() * 4)] ?? "#3b3d40",
        wall: ["#d8d0c3", "#c9c2b6", "#e6e0d6"][Math.floor(rnd() * 3)] ?? "#d8d0c3",
        rot: (rnd() - 0.5) * 0.3,
      });
    }
    return list;
  }, []);
  return (
    <group>
      {homes.map((h, i) => (
        <NeighbourHome key={i} {...h} />
      ))}
    </group>
  );
}

function NeighbourHome({ x, z, w, d, h, roof, wall, rot }: { x: number; z: number; w: number; d: number; h: number; roof: string; wall: string; rot: number }) {
  const geo = useMemo(() => hipRoofGeometry({ width: w + 1.2, depth: d + 1.2, eaveY: h, pitch: 0.42 }), [w, d, h]);
  return (
    <group position={[x, 0, z]} rotation-y={rot}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={roof} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Landscape() {
  const trees = useMemo(() => {
    const rnd = mulberry32(3);
    const pts: { p: [number, number, number]; s: number; palm: boolean }[] = [
      { p: [-7.5, 0, 6], s: 1.1, palm: true },
      { p: [8.5, 0, 5.5], s: 1.2, palm: true },
      { p: [-12.5, 0, -6.5], s: 1.0, palm: true },
      { p: [9.5, 0, -6], s: 1.4, palm: false },
      { p: [-4, 0, -9], s: 1.6, palm: false },
    ];
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 16 + rnd() * 30;
      pts.push({ p: [Math.cos(a) * r, 0, Math.sin(a) * r], s: 1 + rnd() * 1.2, palm: rnd() > 0.7 });
    }
    return pts;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (t.palm ? <Palm key={i} position={t.p} scale={t.s} seed={i} /> : <Canopy key={i} position={t.p} scale={t.s} seed={i} />))}
      {/* Low hedges along the front */}
      <mesh position={[-4.5, 0.45, 5.4]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 0.9, 1]} />
        <meshStandardMaterial color="#2f3d24" roughness={1} />
      </mesh>
      <mesh position={[7.2, 0.45, 5.4]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.9, 1]} />
        <meshStandardMaterial color="#2f3d24" roughness={1} />
      </mesh>
    </group>
  );
}

function Canopy({ position, scale, seed }: { position: [number, number, number]; scale: number; seed: number }) {
  const blobs = useMemo(() => {
    const rnd = mulberry32(seed + 11);
    return Array.from({ length: 4 }, () => ({
      p: [(rnd() - 0.5) * 2, 3.4 + rnd() * 1.4, (rnd() - 0.5) * 2] as [number, number, number],
      r: 1.3 + rnd() * 0.9,
    }));
  }, [seed]);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.22, 3, 6]} />
        <meshStandardMaterial color="#4a3a2c" roughness={1} />
      </mesh>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.p} castShadow>
          <icosahedronGeometry args={[b.r, 1]} />
          <meshStandardMaterial color="#34452a" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Palm({ position, scale, seed }: { position: [number, number, number]; scale: number; seed: number }) {
  const fronds = useMemo(() => {
    const rnd = mulberry32(seed + 5);
    return Array.from({ length: 9 }, (_, i) => ({ yaw: (i / 9) * Math.PI * 2 + rnd() * 0.3, droop: 0.5 + rnd() * 0.35 }));
  }, [seed]);
  const lean = ((seed % 5) - 2) * 0.04;
  return (
    <group position={position} scale={scale} rotation-z={lean}>
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 5.2, 7]} />
        <meshStandardMaterial color="#6b5a47" roughness={1} />
      </mesh>
      <group position={[0, 5.2, 0]}>
        {fronds.map((f, i) => (
          <group key={i} rotation-y={f.yaw}>
            <mesh position={[0.95, -0.25, 0]} rotation-z={-f.droop} castShadow>
              <boxGeometry args={[2.1, 0.03, 0.42]} />
              <meshStandardMaterial color="#3e5a2e" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
