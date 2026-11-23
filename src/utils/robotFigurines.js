import * as THREE from 'three'

/**
 * Procedural Space Robot Astronaut Figurines for YUKTI '27 (AI x Human Nexus)
 * 
 * True Humanoid Astronauts floating and spacewalking in deep space:
 * 1. Robo-Astronaut 1: "The Commander" (Humanoid astronaut in spacewalking posture, multi-axis gentle space-drift)
 * 2. Robo-Astronaut 2: "The Cyber-Explorer" (Humanoid with thruster pack, micro-gravity floating pose)
 * 3. Robo-Astronaut 3: "The Synthesis Drone" (Compact companion astronaut unit with helmet visor and telemetry antennae)
 */

export const createRoboMaterials = () => {
  // Polished aerospace gold
  const aerospaceGold = new THREE.MeshStandardMaterial({
    color: 0xF5D77F,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0x382005,
    emissiveIntensity: 0.2,
  })

  // Deep space-suit composite purple
  const deepComposite = new THREE.MeshStandardMaterial({
    color: 0x2A113B,
    metalness: 0.7,
    roughness: 0.35,
    emissive: 0x150720,
    emissiveIntensity: 0.4,
  })

  // Helmet Visor mirror glass reflecting cosmic surroundings
  const helmetVisorGold = new THREE.MeshStandardMaterial({
    color: 0xFFF2A6,
    metalness: 0.98,
    roughness: 0.1,
    emissive: 0xF5D77F,
    emissiveIntensity: 0.6,
  })

  // Cyan telemetry lights & chest console
  const cyanGlow = new THREE.MeshBasicMaterial({
    color: 0x38BDF8,
  })

  const thrusterFlame = new THREE.MeshBasicMaterial({
    color: 0x60A5FA,
    transparent: true,
    opacity: 0.85,
  })

  return { aerospaceGold, deepComposite, helmetVisorGold, cyanGlow, thrusterFlame }
}

/**
 * Helper to build a complete Humanoid Spacewalking Astronaut Doll / Figurine
 */
const buildHumanoidAstronaut = (materials, scale = 1.0) => {
  const astronaut = new THREE.Group()

  // 1. Torso / Life Support Suit
  const chest = new THREE.Mesh(
    new THREE.BoxGeometry(0.7 * scale, 0.9 * scale, 0.45 * scale),
    materials.deepComposite
  )
  chest.position.y = 0.5 * scale
  astronaut.add(chest)

  // Chest Armor Plate (Gold)
  const armorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.6 * scale, 0.45 * scale, 0.12 * scale),
    materials.aerospaceGold
  )
  armorPlate.position.set(0, 0.6 * scale, 0.24 * scale)
  astronaut.add(armorPlate)

  // Telemetry HUD lights on chest
  const chestLight1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.12 * scale, 0.06 * scale, 0.05 * scale),
    materials.cyanGlow
  )
  chestLight1.position.set(-0.16 * scale, 0.65 * scale, 0.31 * scale)
  astronaut.add(chestLight1)

  const chestLight2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08 * scale, 0.06 * scale, 0.05 * scale),
    materials.cyanGlow
  )
  chestLight2.position.set(0.16 * scale, 0.65 * scale, 0.31 * scale)
  astronaut.add(chestLight2)

  // 2. Helmet & Visor
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.38 * scale, 24, 24),
    materials.deepComposite
  )
  helmet.position.y = 1.25 * scale
  astronaut.add(helmet)

  // Large Gold Reflective Astronaut Visor
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.32 * scale, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.helmetVisorGold
  )
  visor.rotation.x = Math.PI / 2
  visor.position.set(0, 1.25 * scale, 0.15 * scale)
  astronaut.add(visor)

  // Helmet side communications beacon
  const comBeacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.25 * scale, 8),
    materials.aerospaceGold
  )
  comBeacon.position.set(0.38 * scale, 1.4 * scale, 0)
  astronaut.add(comBeacon)

  // 3. Life Support Backpack / Jetpack (PLSS)
  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.55 * scale, 0.75 * scale, 0.3 * scale),
    materials.aerospaceGold
  )
  backpack.position.set(0, 0.55 * scale, -0.32 * scale)
  astronaut.add(backpack)

  // Dual Thruster nozzles at bottom of backpack
  const nozzleL = new THREE.Mesh(
    new THREE.ConeGeometry(0.09 * scale, 0.18 * scale, 12),
    materials.deepComposite
  )
  nozzleL.rotation.x = Math.PI
  nozzleL.position.set(-0.18 * scale, 0.12 * scale, -0.32 * scale)
  astronaut.add(nozzleL)

  const nozzleR = nozzleL.clone()
  nozzleR.position.x = 0.18 * scale
  astronaut.add(nozzleR)

  // Thruster plume (subtle blue glow)
  const plumeL = new THREE.Mesh(
    new THREE.ConeGeometry(0.06 * scale, 0.25 * scale, 8),
    materials.thrusterFlame
  )
  plumeL.rotation.x = Math.PI
  plumeL.position.set(-0.18 * scale, -0.05 * scale, -0.32 * scale)
  astronaut.add(plumeL)

  const plumeR = plumeL.clone()
  plumeR.position.x = 0.18 * scale
  astronaut.add(plumeR)

  // 4. Arms (Floating microgravity gesture)
  // Left Shoulder & Arm
  const armL = new THREE.Group()
  const bicepL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11 * scale, 0.1 * scale, 0.45 * scale, 12),
    materials.aerospaceGold
  )
  bicepL.position.y = -0.22 * scale
  armL.add(bicepL)

  const gloveL = new THREE.Mesh(
    new THREE.SphereGeometry(0.12 * scale, 12, 12),
    materials.deepComposite
  )
  gloveL.position.y = -0.48 * scale
  armL.add(gloveL)

  armL.position.set(-0.48 * scale, 0.85 * scale, 0)
  armL.rotation.z = 0.5
  armL.rotation.x = -0.3
  astronaut.add(armL)

  // Right Shoulder & Arm
  const armR = new THREE.Group()
  const bicepR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11 * scale, 0.1 * scale, 0.45 * scale, 12),
    materials.aerospaceGold
  )
  bicepR.position.y = -0.22 * scale
  armR.add(bicepR)

  const gloveR = new THREE.Mesh(
    new THREE.SphereGeometry(0.12 * scale, 12, 12),
    materials.deepComposite
  )
  gloveR.position.y = -0.48 * scale
  armR.add(gloveR)

  armR.position.set(0.48 * scale, 0.85 * scale, 0)
  armR.rotation.z = -0.6
  armR.rotation.x = 0.4
  astronaut.add(armR)

  // 5. Legs (Floating zero-gravity bend)
  // Left Leg
  const legL = new THREE.Group()
  const thighL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.11 * scale, 0.55 * scale, 12),
    materials.deepComposite
  )
  thighL.position.y = -0.27 * scale
  legL.add(thighL)

  const bootL = new THREE.Mesh(
    new THREE.BoxGeometry(0.18 * scale, 0.15 * scale, 0.28 * scale),
    materials.aerospaceGold
  )
  bootL.position.set(0, -0.6 * scale, 0.05 * scale)
  legL.add(bootL)

  legL.position.set(-0.2 * scale, 0.05 * scale, 0)
  legL.rotation.x = 0.25
  legL.rotation.z = 0.15
  astronaut.add(legL)

  // Right Leg (bent in running/floating space stride)
  const legR = new THREE.Group()
  const thighR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.11 * scale, 0.55 * scale, 12),
    materials.deepComposite
  )
  thighR.position.y = -0.27 * scale
  legR.add(thighR)

  const bootR = new THREE.Mesh(
    new THREE.BoxGeometry(0.18 * scale, 0.15 * scale, 0.28 * scale),
    materials.aerospaceGold
  )
  bootR.position.set(0, -0.6 * scale, 0.05 * scale)
  legR.add(bootR)

  legR.position.set(0.2 * scale, 0.05 * scale, 0)
  legR.rotation.x = -0.4
  legR.rotation.z = -0.1
  astronaut.add(legR)

  return astronaut
}

/**
 * 1. The Commander (Leading Spacewalker)
 */
export const buildCommanderAstronaut = (materials) => {
  const group = buildHumanoidAstronaut(materials, 1.0)
  group.position.set(-3.2, 1.4, -1.0)
  group.rotation.set(0.2, 0.4, -0.2)

  return {
    group,
    rotX: 0.004,
    rotY: 0.008,
    rotZ: 0.003,
    orbitR: 3.5,
    orbitY: 1.4,
    speed: 0.00035,
    phase: 0.2,
  }
}

/**
 * 2. The Cyber-Explorer (Mid-Space Floating Spacewalker)
 */
export const buildExplorerAstronaut = (materials) => {
  const group = buildHumanoidAstronaut(materials, 0.88)
  group.position.set(3.4, -1.2, -1.2)
  group.rotation.set(-0.3, -0.5, 0.3)

  return {
    group,
    rotX: -0.005,
    rotY: -0.007,
    rotZ: -0.004,
    orbitR: 3.8,
    orbitY: -1.2,
    speed: -0.0003,
    phase: 1.8,
  }
}

/**
 * 3. The Scout (Foreground Microgravity Astronaut)
 */
export const buildScoutAstronaut = (materials) => {
  const group = buildHumanoidAstronaut(materials, 0.75)
  group.position.set(-1.4, -2.6, -0.6)
  group.rotation.set(0.4, 0.2, 0.3)

  return {
    group,
    rotX: 0.006,
    rotY: -0.005,
    rotZ: 0.008,
    orbitR: 2.4,
    orbitY: -2.6,
    speed: 0.00045,
    phase: 3.5,
  }
}
