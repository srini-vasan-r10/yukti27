import * as THREE from 'three'

/**
 * Procedural 3D Robot Figurines & Horizon Sun for YUKTI '27 (AI x Human Nexus)
 * 
 * Includes:
 * 1. The Horizon Eye-Level Cosmic Sun with corona glow & lens glare
 * 2. Robo Figurine 1: "The Strategist" (Humanoid Android Thinker - Clockwise Yaw & Pitch)
 * 3. Robo Figurine 2: "The Cyber-Muse" (Kinetic Dancer / Ribbon Drone - Counter-clockwise Roll & Orbit)
 * 4. Robo Figurine 3: "The Synthesis Sentinel" (Multi-optic floating biped/drone - Dynamic Dual-axis Spin)
 */

export const createHorizonSun = (scene) => {
  const sunGroup = new THREE.Group()

  // 1. High-Intensity Radiant Sun Sphere at Eye-Level Horizon
  const sunGeo = new THREE.SphereGeometry(1.2, 32, 32)
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xFFF7D6,
    transparent: true,
    opacity: 0.95,
  })
  const sunCore = new THREE.Mesh(sunGeo, sunMat)
  sunGroup.add(sunCore)

  // 2. Multi-tier Radiant Corona Halos
  const coronaGeo1 = new THREE.RingGeometry(1.3, 2.6, 64)
  const coronaMat1 = new THREE.MeshBasicMaterial({
    color: 0xF5D77F,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
  })
  const corona1 = new THREE.Mesh(coronaGeo1, coronaMat1)
  sunGroup.add(corona1)

  const coronaGeo2 = new THREE.RingGeometry(2.4, 4.8, 64)
  const coronaMat2 = new THREE.MeshBasicMaterial({
    color: 0xC59B3C,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.22,
  })
  const corona2 = new THREE.Mesh(coronaGeo2, coronaMat2)
  sunGroup.add(corona2)

  // Position at eye level in the background horizon
  sunGroup.position.set(0, 0.6, -6.5)
  scene.add(sunGroup)

  // Point lights emanating from the Sun location to cast strong specular highlights on all robots
  const sunKeyLight = new THREE.PointLight(0xFFF2A6, 80, 50, 1.2)
  sunKeyLight.position.set(0, 0.8, -4.5)
  scene.add(sunKeyLight)

  const sunFillLight = new THREE.DirectionalLight(0xF5D77F, 3.5)
  sunFillLight.position.set(0, 2, -2)
  scene.add(sunFillLight)

  return { sunGroup, corona1, corona2 }
}

/**
 * Creates Shared PBR Materials that strongly reflect the Horizon Sun
 */
export const createRoboMaterials = () => {
  const polishedGold = new THREE.MeshStandardMaterial({
    color: 0xF5D77F,
    metalness: 0.94,
    roughness: 0.16,
    emissive: 0x382005,
    emissiveIntensity: 0.35,
  })

  const deepChromePurple = new THREE.MeshStandardMaterial({
    color: 0x4D1D64,
    metalness: 0.88,
    roughness: 0.22,
    emissive: 0x1F0E2C,
    emissiveIntensity: 0.5,
  })

  const cyanVisorGlow = new THREE.MeshStandardMaterial({
    color: 0x38BDF8,
    metalness: 0.2,
    roughness: 0.1,
    emissive: 0x38BDF8,
    emissiveIntensity: 1.6,
  })

  const coreSparkleMat = new THREE.MeshBasicMaterial({
    color: 0xFFF2A6,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
  })

  return { polishedGold, deepChromePurple, cyanVisorGlow, coreSparkleMat }
}

/**
 * Robo 1: "The Strategist" (Humanoid Android Executive)
 * Fuses human brain silhouette with synthetic angular torso & glowing visor
 */
export const buildStrategistRobo = (materials) => {
  const group = new THREE.Group()

  // Head
  const headGeo = new THREE.BoxGeometry(0.55, 0.6, 0.55)
  const head = new THREE.Mesh(headGeo, materials.polishedGold)
  head.position.y = 0.95
  group.add(head)

  // Glowing Visor facing forward towards the horizon sun
  const visorGeo = new THREE.BoxGeometry(0.58, 0.16, 0.22)
  const visor = new THREE.Mesh(visorGeo, materials.cyanVisorGlow)
  visor.position.set(0, 0.98, 0.24)
  group.add(visor)

  // Torso / Chassis
  const chestGeo = new THREE.CylinderGeometry(0.5, 0.35, 0.9, 6)
  const chest = new THREE.Mesh(chestGeo, materials.deepChromePurple)
  chest.position.y = 0.35
  group.add(chest)

  // Inner Logic Core Sphere (glowing inside wireframe cage)
  const coreGeo = new THREE.SphereGeometry(0.24, 16, 16)
  const core = new THREE.Mesh(coreGeo, materials.cyanVisorGlow)
  core.position.set(0, 0.35, 0.12)
  group.add(core)

  const coreCage = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 1), materials.coreSparkleMat)
  coreCage.position.set(0, 0.35, 0.12)
  group.add(coreCage)

  // Articulated Shoulders & Forearms
  const shoulderGeo = new THREE.SphereGeometry(0.18, 12, 12)
  const shoulderL = new THREE.Mesh(shoulderGeo, materials.polishedGold)
  shoulderL.position.set(-0.6, 0.65, 0)
  group.add(shoulderL)

  const armLGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8)
  const armL = new THREE.Mesh(armLGeo, materials.polishedGold)
  armL.position.set(-0.65, 0.3, 0)
  group.add(armL)

  const shoulderR = new THREE.Mesh(shoulderGeo, materials.polishedGold)
  shoulderR.position.set(0.6, 0.65, 0)
  group.add(shoulderR)

  const armRGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8)
  const armR = new THREE.Mesh(armRGeo, materials.polishedGold)
  armR.position.set(0.65, 0.3, 0)
  group.add(armR)

  // Base Propulsion Nozzle
  const thrusterGeo = new THREE.ConeGeometry(0.32, 0.45, 6)
  const thruster = new THREE.Mesh(thrusterGeo, materials.polishedGold)
  thruster.rotation.x = Math.PI
  thruster.position.y = -0.3
  group.add(thruster)

  // Scale & Position
  group.scale.set(1.1, 1.1, 1.1)
  group.position.set(-3.6, 1.8, -1.2)

  return {
    group,
    rotX: 0.007,
    rotY: 0.013, // Clockwise yaw
    rotZ: 0.004,
    orbitR: 4.0,
    orbitY: 1.8,
    speed: 0.00045,
    phase: 0.5,
  }
}

/**
 * Robo 2: "The Cyber-Muse" (Kinetic Dancer / Artist Nexus)
 * Kinetic gyroscope ribbons spinning around a sleek aerodynamic chrome figure
 */
export const buildCyberMuseRobo = (materials) => {
  const group = new THREE.Group()

  // Sleek Aerodynamic Torso
  const bodyGeo = new THREE.OctahedronGeometry(0.7, 2)
  const body = new THREE.Mesh(bodyGeo, materials.deepChromePurple)
  group.add(body)

  // Visor Mask
  const maskGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 32)
  const mask = new THREE.Mesh(maskGeo, materials.cyanVisorGlow)
  mask.position.set(0, 0.45, 0.28)
  mask.rotation.x = 0.2
  group.add(mask)

  // Kinetic Gyroscopic Acoustic Rings
  const ringGeo1 = new THREE.TorusGeometry(1.1, 0.03, 8, 64)
  const ring1 = new THREE.Mesh(ringGeo1, materials.polishedGold)
  ring1.rotation.set(Math.PI / 4, 0.3, 0)
  group.add(ring1)

  const ringGeo2 = new THREE.TorusGeometry(1.35, 0.025, 8, 64)
  const ring2 = new THREE.Mesh(ringGeo2, materials.coreSparkleMat)
  ring2.rotation.set(-Math.PI / 3, 0.6, 0.4)
  group.add(ring2)

  // Crown Crest Crystals (Human Artistry / Melody)
  for (let i = 0; i < 5; i++) {
    const angle = (i / 4 - 0.5) * 1.2
    const crystalGeo = new THREE.ConeGeometry(0.08, 0.35, 4)
    const crystal = new THREE.Mesh(crystalGeo, materials.polishedGold)
    crystal.position.set(Math.sin(angle) * 0.45, 0.75 + Math.cos(angle) * 0.15, 0)
    crystal.rotation.z = -angle * 0.8
    group.add(crystal)
  }

  group.scale.set(1.05, 1.05, 1.05)
  group.position.set(3.8, -1.8, -1.5)

  return {
    group,
    ring1,
    ring2,
    rotX: -0.009,
    rotY: -0.012, // Counter-clockwise roll
    rotZ: -0.015,
    orbitR: 4.4,
    orbitY: -1.8,
    speed: -0.00038,
    phase: 2.2,
  }
}

/**
 * Robo 3: "The Sentinel Drone" (Autonomous Synthesis Companion)
 * Multi-optic floating orb with dynamic gyro thrusters and sensor antennae
 */
export const buildSentinelDrone = (materials) => {
  const group = new THREE.Group()

  // Central Core Orb
  const orbGeo = new THREE.DodecahedronGeometry(0.65, 1)
  const orb = new THREE.Mesh(orbGeo, materials.polishedGold)
  group.add(orb)

  // Dual Articulated Optic Lenses (Eyes)
  const eyeGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.22, 16)
  const eyeL = new THREE.Mesh(eyeGeo, materials.cyanVisorGlow)
  eyeL.rotation.x = Math.PI / 2
  eyeL.position.set(-0.24, 0.12, 0.55)
  group.add(eyeL)

  const eyeR = new THREE.Mesh(eyeGeo, materials.cyanVisorGlow)
  eyeR.rotation.x = Math.PI / 2
  eyeR.position.set(0.24, 0.12, 0.55)
  group.add(eyeR)

  // Floating Thruster Pods (Left & Right)
  const podGeo = new THREE.CapsuleGeometry(0.12, 0.4, 4, 8)
  const podL = new THREE.Mesh(podGeo, materials.deepChromePurple)
  podL.position.set(-0.85, -0.1, 0)
  group.add(podL)

  const podR = new THREE.Mesh(podGeo, materials.deepChromePurple)
  podR.position.set(0.85, -0.1, 0)
  group.add(podR)

  // Wireframe Sensor Halo
  const haloGeo = new THREE.RingGeometry(0.8, 0.88, 32)
  const halo = new THREE.Mesh(haloGeo, materials.coreSparkleMat)
  halo.rotation.x = Math.PI / 2
  group.add(halo)

  group.scale.set(0.95, 0.95, 0.95)
  group.position.set(-1.6, -3.2, -0.5)

  return {
    group,
    rotX: 0.014, // Rapid pitch & wobble
    rotY: -0.008,
    rotZ: 0.012,
    orbitR: 2.8,
    orbitY: -3.2,
    speed: 0.00052,
    phase: 4.1,
  }
}
