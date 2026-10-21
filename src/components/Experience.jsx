import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '../store/scrollStore'
import CentralStructure from './Scene/CentralStructure'
import OrbitalRings from './Scene/OrbitalRings'
import ParticleField from './Scene/ParticleField'
import ConnectionLines from './Scene/ConnectionLines'
import PillarNodes from './Scene/PillarNodes'
import SceneLighting from './Scene/SceneLighting'

function CameraController() {
  const { camera, size } = useThree()
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((_, delta) => {
    // Dynamically adjust globe position: Center on mobile (width < 768), Left on desktop
    const isMobile = size.width < 768
    const targetGlobeX = isMobile ? 0 : -5.5
    const targetGlobeY = isMobile ? 1.5 : 0
    scrollStore.globeX += (targetGlobeX - scrollStore.globeX) * Math.min(delta * 5, 0.2)
    scrollStore.globeY += (targetGlobeY - scrollStore.globeY) * Math.min(delta * 5, 0.2)

    // Camera follow lerp
    const factor = Math.min(delta * 4, 0.15)
    camera.position.x += (scrollStore.camX - camera.position.x) * factor
    camera.position.y += (scrollStore.camY - camera.position.y) * factor
    camera.position.z += (scrollStore.camZ - camera.position.z) * factor

    targetLook.current.x += (scrollStore.lookX - targetLook.current.x) * factor
    targetLook.current.y += (scrollStore.lookY - targetLook.current.y) * factor
    targetLook.current.z += (scrollStore.lookZ - targetLook.current.z) * factor

    camera.lookAt(targetLook.current)
  })

  return null
}

function ResponsiveGlobeGroup() {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = scrollStore.globeX
      groupRef.current.position.y = scrollStore.globeY
    }
  })

  return (
    <group ref={groupRef} position={[-5.5, 0, 0]}>
      <CentralStructure />
      <OrbitalRings />
      <ConnectionLines />
      <PillarNodes />
    </group>
  )
}

export default function Experience({ dpr = [1, 2], particleCount = 2000 }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 1, 32], fov: 50, near: 0.1, far: 250 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x07020d)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
      >
        <CameraController />
        <SceneLighting />
        <ResponsiveGlobeGroup />
        <ParticleField count={particleCount} />
      </Canvas>
    </div>
  )
}
