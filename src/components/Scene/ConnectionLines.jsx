import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '../../store/scrollStore'
import { STRATEGIC_DOMAINS } from '../../utils/constants'

/**
 * ConnectionLines — animated lines radiating from the origin to each
 * of the 6 strategic-domain pillar positions.
 */

const ORIGIN = new THREE.Vector3(0, 0, 0)
const SEGMENTS = 64

const GOLD = new THREE.Color(0xc9a84c)

function buildLinePositions(target) {
  const arr = new Float32Array(SEGMENTS * 3)
  const tgt = new THREE.Vector3(...target)
  const tmp = new THREE.Vector3()

  for (let i = 0; i < SEGMENTS; i++) {
    const t = i / (SEGMENTS - 1)
    tmp.lerpVectors(ORIGIN, tgt, t)
    tmp.y += Math.sin(t * Math.PI) * 0.6
    arr[i * 3]     = tmp.x
    arr[i * 3 + 1] = tmp.y
    arr[i * 3 + 2] = tmp.z
  }

  return arr
}

function ConnectionLine({ target }) {
  const lineRef = useRef()
  const sphereRef = useRef()
  const materialRef = useRef()
  const sphereMaterialRef = useRef()

  const positions = useMemo(() => buildLinePositions(target), [target])

  useFrame(() => {
    const progress = scrollStore.connectionProgress
    const nodesVisible = scrollStore.nodesVisible

    // ── Draw range ───────────────────────────────────────────
    if (lineRef.current) {
      const count = Math.floor(progress * SEGMENTS)
      lineRef.current.geometry.setDrawRange(0, count)
    }

    if (materialRef.current) {
      materialRef.current.opacity = progress * 0.55
    }

    if (sphereRef.current) {
      const s = nodesVisible * 0.4
      sphereRef.current.scale.setScalar(s)
    }
    if (sphereMaterialRef.current) {
      sphereMaterialRef.current.opacity = nodesVisible * 0.8
    }
  })

  return (
    <group>
      {/* Native R3F primitive for THREE.Line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={SEGMENTS}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={materialRef}
          color={GOLD}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </line>

      {/* Endpoint glow sphere */}
      <mesh ref={sphereRef} position={target} scale={0}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          ref={sphereMaterialRef}
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.2}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function ConnectionLines() {
  return (
    <group>
      {STRATEGIC_DOMAINS.map((domain) => (
        <ConnectionLine key={domain.id} target={domain.position} />
      ))}
    </group>
  )
}
