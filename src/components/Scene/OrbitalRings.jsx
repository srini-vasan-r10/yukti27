import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '../../store/scrollStore'

const DEG = Math.PI / 180

const RING_DEFS = [
  { radius: 6.8, tube: 0.035, tiltX: 30 * DEG, tiltZ: 0,        dir: 1 },
  { radius: 8.8, tube: 0.025, tiltX: 0,        tiltZ: 60 * DEG, dir: -1 },
  { radius: 10.8, tube: 0.03,  tiltX: 45 * DEG, tiltZ: 45 * DEG, dir: 1.2 },
]

const GOLD = new THREE.Color(0xc9a84c)

function Ring({ def, index }) {
  const groupRef = useRef()
  const materialRef = useRef()

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const { velocity } = scrollStore
    const opacityKeys = ['ring1Opacity', 'ring2Opacity', 'ring3Opacity']
    const opacity = scrollStore[opacityKeys[index]] ?? 0.5

    if (materialRef.current) {
      materialRef.current.opacity = opacity
    }

    // Directional velocity-linked spinning
    const speed = ((velocity * 0.003) + 0.08) * def.dir
    groupRef.current.rotation.z += speed * delta * 5
  })

  return (
    <group ref={groupRef} rotation={[def.tiltX, 0, def.tiltZ]}>
      <mesh>
        <torusGeometry args={[def.radius, def.tube, 16, 100]} />
        <meshStandardMaterial
          ref={materialRef}
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

export default function OrbitalRings() {
  return (
    <group>
      {RING_DEFS.map((def, i) => (
        <Ring key={i} def={def} index={i} />
      ))}
    </group>
  )
}
