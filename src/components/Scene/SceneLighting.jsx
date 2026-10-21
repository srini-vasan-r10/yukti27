import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '../../store/scrollStore'

/**
 * SceneLighting — comprehensive lighting setup driven by scroll state.
 *
 * Lights:
 *   1. Ambient (purple-tinted)   — intensity from ambientIntensity
 *   2. Point  (gold key)         — position & intensity from goldLight*
 *   3. Spot   (dramatic accent)  — intensity from spotIntensity, target from spotTarget*
 *   4. Point  (purple rim fill)  — fixed position, low intensity
 *
 * Also manages scene fog (color #0a0015, near/far from scrollStore).
 */

const PURPLE_AMBIENT = new THREE.Color(0x2d1b69)
const GOLD_KEY = new THREE.Color(0xffd700)
const GOLD_SPOT = new THREE.Color(0xc9a84c)
const PURPLE_RIM = new THREE.Color(0x4a2c8a)
const FOG_COLOR = new THREE.Color(0x0a0015)

export default function SceneLighting() {
  const ambientRef = useRef()
  const goldLightRef = useRef()
  const spotRef = useRef()
  const spotTargetRef = useRef()
  const rimRef = useRef()

  const { scene } = useThree()

  // ── Initialise fog once ──────────────────────────────────────
  useEffect(() => {
    scene.fog = new THREE.Fog(FOG_COLOR, scrollStore.fogNear, scrollStore.fogFar)

    return () => {
      // Clean up fog on unmount
      scene.fog = null
    }
  }, [scene])

  useFrame(() => {
    const {
      ambientIntensity,
      goldLightIntensity,
      goldLightX,
      goldLightY,
      goldLightZ,
      spotIntensity,
      spotTargetX,
      spotTargetY,
      spotTargetZ,
      fogNear,
      fogFar,
    } = scrollStore

    // ── Ambient ──────────────────────────────────────────────
    if (ambientRef.current) {
      ambientRef.current.intensity = ambientIntensity
    }

    // ── Gold key light ───────────────────────────────────────
    if (goldLightRef.current) {
      goldLightRef.current.intensity = goldLightIntensity
      goldLightRef.current.position.set(goldLightX, goldLightY, goldLightZ)
    }

    // ── Spot light ───────────────────────────────────────────
    if (spotRef.current) {
      spotRef.current.intensity = spotIntensity
    }
    if (spotTargetRef.current) {
      spotTargetRef.current.position.set(spotTargetX, spotTargetY, spotTargetZ)
    }

    // ── Fog ──────────────────────────────────────────────────
    if (scene.fog) {
      scene.fog.near = fogNear
      scene.fog.far = fogFar
    }
  })

  return (
    <>
      {/* Purple-tinted ambient */}
      <ambientLight
        ref={ambientRef}
        color={PURPLE_AMBIENT}
        intensity={scrollStore.ambientIntensity}
      />

      {/* Gold key point light */}
      <pointLight
        ref={goldLightRef}
        color={GOLD_KEY}
        intensity={0}
        distance={60}
        decay={2}
        position={[5, 5, 10]}
      />

      {/* Dramatic spotlight */}
      <spotLight
        ref={spotRef}
        color={GOLD_SPOT}
        intensity={0}
        position={[0, 15, 10]}
        angle={Math.PI / 6}
        penumbra={0.6}
        distance={80}
        decay={2}
        castShadow={false}
        target={spotTargetRef.current ?? undefined}
      />
      {/* Spot target object (invisible) */}
      <object3D ref={spotTargetRef} position={[0, 0, 0]} />

      {/* Purple rim fill */}
      <pointLight
        ref={rimRef}
        color={PURPLE_RIM}
        intensity={0.3}
        distance={40}
        decay={2}
        position={[-10, 5, -10]}
      />
    </>
  )
}
