import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

/**
 * 3D Elephant Mascot (TSM / YUKTI Heritage Mascot)
 * Crafted using low-poly golden & obsidian geometric Three.js primitives
 * with floating trunk, tusks, ears, and soft responsive hover animation.
 */
export default function ElephantCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const size = 96

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
    // Centered viewpoint framing the whole mascot
    camera.position.set(0, 0.45, 4.4)
    camera.lookAt(0, 0.35, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Materials: Regal Gold and Obsidian
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.88,
      roughness: 0.18,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
    })

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.8,
      roughness: 0.3,
    })

    const tuskMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      metalness: 0.4,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.2,
    })

    const group = new THREE.Group()
    scene.add(group)

    // Elephant Body (Rounded Octahedron)
    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 0), darkMat)
    body.position.set(0, 0, 0)
    group.add(body)

    // Elephant Head
    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), goldMat)
    head.position.set(0, 0.55, 0.6)
    group.add(head)

    // Trunk (Segmented Golden Curve)
    const trunkUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.45, 8), goldMat)
    trunkUpper.position.set(0, 0.32, 1.05)
    trunkUpper.rotation.x = -Math.PI / 6
    group.add(trunkUpper)

    const trunkMid = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.4, 8), goldMat)
    trunkMid.position.set(0, 0.12, 1.25)
    trunkMid.rotation.x = -Math.PI / 3
    group.add(trunkMid)

    const trunkTip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), goldMat)
    trunkTip.position.set(0, 0.25, 1.45)
    group.add(trunkTip)

    // Ears (Large Regal Flaps)
    const earGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 12)
    const leftEar = new THREE.Mesh(earGeo, goldMat)
    leftEar.position.set(-0.62, 0.6, 0.4)
    leftEar.rotation.set(0, Math.PI / 4, Math.PI / 6)
    group.add(leftEar)

    const rightEar = new THREE.Mesh(earGeo, goldMat)
    rightEar.position.set(0.62, 0.6, 0.4)
    rightEar.rotation.set(0, -Math.PI / 4, -Math.PI / 6)
    group.add(rightEar)

    // Tusks
    const tuskGeo = new THREE.ConeGeometry(0.06, 0.45, 8)
    const leftTusk = new THREE.Mesh(tuskGeo, tuskMat)
    leftTusk.position.set(-0.2, 0.32, 0.95)
    leftTusk.rotation.set(Math.PI / 3, 0, -0.2)
    group.add(leftTusk)

    const rightTusk = new THREE.Mesh(tuskGeo, tuskMat)
    rightTusk.position.set(0.2, 0.32, 0.95)
    rightTusk.rotation.set(Math.PI / 3, 0, 0.2)
    group.add(rightTusk)

    // Golden Halo Ring around the mascot
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.015, 8, 48),
      goldMat
    )
    halo.rotation.x = Math.PI / 2.3
    group.add(halo)

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(amb)

    const key = new THREE.PointLight(0xf59e0b, 18, 12)
    key.position.set(2, 3, 3)
    scene.add(key)

    const rim = new THREE.PointLight(0x38bdf8, 10, 10)
    rim.position.set(-2, -1, 2)
    scene.add(rim)

    let animId
    let t = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.02
      group.rotation.y = Math.sin(t * 0.8) * 0.35
      group.position.y = Math.sin(t * 1.5) * 0.08
      halo.rotation.z += 0.01
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: 96,
        height: 96,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    />
  )
}
