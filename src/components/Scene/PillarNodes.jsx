import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import scrollStore from '../../store/scrollStore'
import { STRATEGIC_DOMAINS } from '../../utils/constants'

/**
 * PillarNodes — 6 distinct geometric shapes at the strategic-domain positions.
 *
 * Geometries (one per pillar):
 *   0  Octahedron      — Marketing & Brand Strategy
 *   1  Dodecahedron    — Finance & Investment
 *   2  Tetrahedron     — Operations & Supply Chain
 *   3  Box             — Business Analytics
 *   4  Icosahedron     — Strategy Consulting
 *   5  TorusKnot       — Human Resources & Leadership
 *
 * Each node:
 *   - Has gold <Edges> wireframe + dark-purple transparent fill
 *   - Self-rotates at a unique speed
 *   - Scales 0→1 via scrollStore.nodesVisible
 *   - Gains emissive glow when activeNode === its index
 */

const GOLD = new THREE.Color(0xc9a84c)
const DARK_PURPLE = new THREE.Color(0x1a0a2e)
const HIGHLIGHT_COLOR = new THREE.Color(0xffd700)

// Unique rotation speeds per pillar (radians / sec)
const ROTATION_SPEEDS = [0.25, 0.2, 0.3, 0.18, 0.22, 0.15]

/**
 * Factory for the six distinct pillar geometries.
 * Returns JSX geometry elements.
 */
function PillarGeometry({ index }) {
  switch (index) {
    case 0: return <octahedronGeometry args={[0.5, 0]} />
    case 1: return <dodecahedronGeometry args={[0.5, 0]} />
    case 2: return <tetrahedronGeometry args={[0.55, 0]} />
    case 3: return <boxGeometry args={[0.7, 0.7, 0.7]} />
    case 4: return <icosahedronGeometry args={[0.5, 0]} />
    case 5: return <torusKnotGeometry args={[0.35, 0.1, 64, 16]} />
    default: return <octahedronGeometry args={[0.5, 0]} />
  }
}

function PillarNode({ domain, index }) {
  const groupRef = useRef()
  const edgeMaterialRef = useRef()
  const solidMaterialRef = useRef()

  // Pre-allocate interpolation color
  const _color = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const { nodesVisible, activeNode, nodeHighlight } = scrollStore

    // ── Scale ──────────────────────────────────────────────
    groupRef.current.scale.setScalar(nodesVisible)

    // ── Self-rotation ──────────────────────────────────────
    groupRef.current.rotation.y += delta * ROTATION_SPEEDS[index]
    groupRef.current.rotation.x += delta * ROTATION_SPEEDS[index] * 0.4

    // ── Highlight when active ──────────────────────────────
    const isActive = activeNode === index
    const glowIntensity = isActive ? nodeHighlight : 0

    if (edgeMaterialRef.current) {
      _color.copy(GOLD).lerp(HIGHLIGHT_COLOR, glowIntensity * 0.5)
      edgeMaterialRef.current.color.copy(_color)
      edgeMaterialRef.current.emissive.copy(_color)
      edgeMaterialRef.current.emissiveIntensity = 0.3 + glowIntensity * 2.0
      edgeMaterialRef.current.opacity = 0.8 + glowIntensity * 0.2
    }

    if (solidMaterialRef.current) {
      solidMaterialRef.current.opacity = 0.08 + glowIntensity * 0.15
    }
  })

  return (
    <group ref={groupRef} position={domain.position} scale={0}>
      {/* Wireframe edges */}
      <mesh>
        <PillarGeometry index={index} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={15}>
          <meshStandardMaterial
            ref={edgeMaterialRef}
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </Edges>
      </mesh>

      {/* Solid transparent fill */}
      <mesh>
        <PillarGeometry index={index} />
        <meshStandardMaterial
          ref={solidMaterialRef}
          color={DARK_PURPLE}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function PillarNodes() {
  return (
    <group>
      {STRATEGIC_DOMAINS.map((domain, i) => (
        <PillarNode key={domain.id} domain={domain} index={i} />
      ))}
    </group>
  )
}
