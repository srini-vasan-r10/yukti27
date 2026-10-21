import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import scrollStore from '../../store/scrollStore'

const GOLD = new THREE.Color(0xc9a84c)
const BRIGHT_GOLD = new THREE.Color(0xf0d78c)

export default function CentralStructure() {
  const groupRef = useRef()
  const edgeMaterialRef = useRef()
  const solidMaterialRef = useRef()
  const innerGroupRef = useRef()
  const innerEdgeMaterialRef = useRef()

  const _color = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const {
      centralScale,
      centralEmissive,
      centralEdgeGlow,
      velocity,
    } = scrollStore

    // ── Velocity-driven dynamic spin ────────────────────────
    // Natural constant base spin (0.05) + velocity-driven speed (direction-aware)
    const spinSpeed = (velocity * 0.0035) + 0.05
    groupRef.current.rotation.y += spinSpeed * delta * 12
    groupRef.current.rotation.x += spinSpeed * delta * 4

    // Scale
    groupRef.current.scale.setScalar(centralScale)

    // Edge glow & material colors
    if (edgeMaterialRef.current) {
      edgeMaterialRef.current.emissiveIntensity = centralEdgeGlow
      _color.copy(GOLD).lerp(BRIGHT_GOLD, centralEmissive)
      edgeMaterialRef.current.color.copy(_color)
      edgeMaterialRef.current.emissive.copy(_color)
    }

    if (solidMaterialRef.current) {
      solidMaterialRef.current.opacity = 0.12 + centralEmissive * 0.15
    }

    // Inner octahedron spin
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.x -= spinSpeed * delta * 8
      innerGroupRef.current.rotation.z += spinSpeed * delta * 6
    }

    if (innerEdgeMaterialRef.current) {
      innerEdgeMaterialRef.current.emissiveIntensity = centralEdgeGlow * 0.6
      innerEdgeMaterialRef.current.opacity = 0.4 + centralEmissive * 0.5
    }
  })

  return (
    <group ref={groupRef} scale={1.15}>
      {/* Outer wireframe icosahedron */}
      <mesh>
        <icosahedronGeometry args={[4, 1]} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={15}>
          <meshStandardMaterial
            ref={edgeMaterialRef}
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </Edges>
      </mesh>

      {/* Solid semi-transparent purple fill */}
      <mesh>
        <icosahedronGeometry args={[3.85, 1]} />
        <meshStandardMaterial
          ref={solidMaterialRef}
          color={0x1a0a2e}
          transparent
          opacity={0.18}
          roughness={0.25}
          metalness={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Inner counter-rotating octahedron */}
      <group ref={innerGroupRef}>
        <mesh>
          <octahedronGeometry args={[1.7, 0]} />
          <meshBasicMaterial visible={false} />
          <Edges threshold={10}>
            <meshStandardMaterial
              ref={innerEdgeMaterialRef}
              color={BRIGHT_GOLD}
              emissive={BRIGHT_GOLD}
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
              toneMapped={false}
            />
          </Edges>
        </mesh>

        <mesh>
          <octahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial
            color={0x2d1b69}
            transparent
            opacity={0.25}
            roughness={0.2}
            metalness={0.8}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}
