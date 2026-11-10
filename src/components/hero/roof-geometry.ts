import * as THREE from "three";

/** Deterministic PRNG so the scene looks identical on every load. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type HipRoofSpec = {
  /** Roof footprint incl. overhang, along X. Must be >= depth. */
  width: number;
  /** Roof footprint incl. overhang, along Z. */
  depth: number;
  /** Eave height. */
  eaveY: number;
  /** Pitch in radians. */
  pitch: number;
};

export function hipRoofPoints({ width, depth, eaveY, pitch }: HipRoofSpec) {
  const hw = width / 2;
  const hd = depth / 2;
  const rise = hd * Math.tan(pitch);
  const ridgeHalf = Math.max(0, hw - hd);
  const ridgeY = eaveY + rise;
  return {
    hw,
    hd,
    rise,
    ridgeY,
    ridgeHalf,
    E1: new THREE.Vector3(-hw, eaveY, hd),
    E2: new THREE.Vector3(hw, eaveY, hd),
    E3: new THREE.Vector3(hw, eaveY, -hd),
    E4: new THREE.Vector3(-hw, eaveY, -hd),
    R1: new THREE.Vector3(-ridgeHalf, ridgeY, 0),
    R2: new THREE.Vector3(ridgeHalf, ridgeY, 0),
  };
}

/** Solid hip roof surface (used as tile underlay and for neighbouring homes). */
export function hipRoofGeometry(spec: HipRoofSpec) {
  const { E1, E2, E3, E4, R1, R2 } = hipRoofPoints(spec);
  const tris = [E1, E2, R2, E1, R2, R1, E2, E3, R2, E3, E4, R1, E3, R1, R2, E4, E1, R1];
  const pos = new Float32Array(tris.length * 3);
  tris.forEach((v, i) => v.toArray(pos, i * 3));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** A single "roll" concrete tile: wave profile extruded along the slope. */
export function tileGeometry(tw: number, tl: number, segments = 8) {
  const shape = new THREE.Shape();
  shape.moveTo(-tw / 2, 0);
  shape.lineTo(tw / 2, 0);
  for (let i = 0; i <= segments; i++) {
    const x = tw / 2 - (i / segments) * tw;
    const s = Math.sin(Math.PI * (x / tw + 0.5));
    shape.lineTo(x, 0.028 + 0.05 * s * s);
  }
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: tl, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -tl / 2);
  g.computeVertexNormals();
  return g;
}

/**
 * Instance matrices for tiles covering all four planes of a hip roof.
 * Each plane frame: X along the eave, Y the plane normal, Z down-slope.
 */
export function hipRoofTileMatrices(
  spec: HipRoofSpec,
  tw: number,
  rowStep: number,
  tileLen: number,
) {
  const { hw, hd, ridgeHalf } = hipRoofPoints(spec);
  const slopeLen = hd / Math.cos(spec.pitch);
  const out: THREE.Matrix4[] = [];
  const planes = [
    { angle: 0, origin: new THREE.Vector3(0, spec.eaveY, hd), base: hw, top: ridgeHalf },
    { angle: Math.PI / 2, origin: new THREE.Vector3(hw, spec.eaveY, 0), base: hd, top: 0 },
    { angle: Math.PI, origin: new THREE.Vector3(0, spec.eaveY, -hd), base: hw, top: ridgeHalf },
    { angle: -Math.PI / 2, origin: new THREE.Vector3(-hw, spec.eaveY, 0), base: hd, top: 0 },
  ];
  const tilt = new THREE.Matrix4().makeRotationX(-0.07);
  const rows = Math.floor((slopeLen - tileLen * 0.25) / rowStep);

  for (const p of planes) {
    const yaw = new THREE.Matrix4().makeRotationY(p.angle);
    const pitchM = new THREE.Matrix4().makeRotationX(-spec.pitch);
    const frame = new THREE.Matrix4()
      .makeTranslation(p.origin.x, p.origin.y, p.origin.z)
      .multiply(yaw)
      .multiply(pitchM);

    for (let r = 0; r < rows; r++) {
      const u = tileLen / 2 + r * rowStep;
      const half = p.base - (u / slopeLen) * (p.base - p.top);
      const cols = Math.floor(half / tw) + 1;
      for (let c = -cols; c <= cols; c++) {
        const x = c * tw;
        if (Math.abs(x) - tw / 2 > half - tw * 0.2) continue;
        const m = new THREE.Matrix4()
          .makeTranslation(x, 0.005 + r * 0.0009, -u)
          .multiply(tilt);
        out.push(new THREE.Matrix4().multiplyMatrices(frame, m));
      }
    }
  }
  return out;
}
