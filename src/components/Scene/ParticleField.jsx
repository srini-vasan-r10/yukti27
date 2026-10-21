import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '../../store/scrollStore'

/**
 * ParticleField — volumetric particle cloud providing depth and atmosphere.
 *
 * 3000 points in a spherical volume. ~10 % are gold, the rest dim purple/white.
 * Custom vertex/fragment shaders add wave motion and soft round points.
 *
 * Uniforms driven by scrollStore: uTime, uOpacity, uSpeed.
 */

const PARTICLE_COUNT = 3000

const vertexShader = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;
uniform float uTime;
uniform float uSpeed;

void main() {
  vColor = aColor;
  vec3 pos = position;
  pos.x += sin(uTime * uSpeed + position.z * 0.5) * 0.3;
  pos.y += cos(uTime * uSpeed + position.x * 0.3) * 0.2;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = /* glsl */ `
varying vec3 vColor;
uniform float uOpacity;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.1, d) * uOpacity;
  gl_FragColor = vec4(vColor, alpha);
}
`

// Gold and purple/white palette
const COLOR_GOLD = new THREE.Color(0xc9a84c)
const COLOR_BRIGHT_GOLD = new THREE.Color(0xf0d78c)
const COLOR_DIM_PURPLE = new THREE.Color(0x7b5ea7)
const COLOR_DIM_WHITE = new THREE.Color(0xa89cc0)
const COLOR_WHITE = new THREE.Color(0xe8e0f0)

export default function ParticleField() {
  const pointsRef = useRef()
  const materialRef = useRef()

  const { positions, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const col = new Float32Array(PARTICLE_COUNT * 3)

    const goldRatio = scrollStore.particleGoldRatio
    const spread = scrollStore.particleSpread

    const tmpColor = new THREE.Color()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random point in a sphere (cube-rejection would be fine, but spherical coords are cleaner)
      const r = Math.cbrt(Math.random()) * spread
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const i3 = i * 3
      pos[i3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)

      sz[i] = 0.02 + Math.random() * 0.1 // 0.02 – 0.12

      // Color assignment
      const isGold = Math.random() < goldRatio
      if (isGold) {
        tmpColor.copy(COLOR_GOLD).lerp(COLOR_BRIGHT_GOLD, Math.random())
      } else {
        // Blend between dim purple, dim white, and off-white
        const t = Math.random()
        if (t < 0.4) tmpColor.copy(COLOR_DIM_PURPLE)
        else if (t < 0.7) tmpColor.copy(COLOR_DIM_WHITE)
        else tmpColor.copy(COLOR_WHITE)
        // Slight randomisation
        tmpColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.08)
      }

      col[i3]     = tmpColor.r
      col[i3 + 1] = tmpColor.g
      col[i3 + 2] = tmpColor.b
    }

    return { positions: pos, sizes: sz, colors: col }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime:    { value: 0 },
      uOpacity: { value: scrollStore.particleOpacity },
      uSpeed:   { value: scrollStore.particleSpeed },
    }),
    [],
  )

  useFrame((_, delta) => {
    if (!materialRef.current) return
    const u = materialRef.current.uniforms
    u.uTime.value += delta
    u.uOpacity.value = scrollStore.particleOpacity
    u.uSpeed.value = scrollStore.particleSpeed
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizes}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColor"
          array={colors}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
