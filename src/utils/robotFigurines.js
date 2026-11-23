import * as THREE from 'three'

/**
 * Procedural Space Robot Astronaut Figurines for YUKTI '27 (AI x Human Nexus)
 * 
 * Distinctly Coloured Astronaut Dolls Floating in Space:
 * 1. Commander (Titanium Gold & Deep Obsidian Suit)
 * 2. Pathfinder (Electric Crimson / Rose-Gold Cyber-Suit)
 * 3. Vanguard (Emerald Cyan / Platinum-Cobalt Deep-Space Suit)
 */

export const createRoboMaterials = () => {
  // Shared Helmet Visor Glass (Warm Metallic Gold Mirror)
  const visorGold = new THREE.MeshStandardMaterial({
    color: 0xFFF2A6,
    metalness: 0.98,
    roughness: 0.08,
    emissive: 0xC59B3C,
    emissiveIntensity: 0.45,
  })

  // Telemetry indicators
  const cyanBeacon = new THREE.MeshBasicMaterial({ color: 0x38BDF8 })
  const goldBeacon = new THREE.MeshBasicMaterial({ color: 0xFFF2A6 })
  const rubyBeacon = new THREE.MeshBasicMaterial({ color: 0xF43F5E })
  const flameBlue = new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.85 })
  const flameAmber = new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.85 })

  // ── ROBOT 1: TITANIUM GOLD & OBSIDIAN (Strategic Leadership) ──
  const robo1Mats = {
    suit: new THREE.MeshStandardMaterial({
      color: 0x1E0D2A, // Royal Deep Obsidian
      metalness: 0.82,
      roughness: 0.28,
      emissive: 0x12051B,
      emissiveIntensity: 0.35,
    }),
    armor: new THREE.MeshStandardMaterial({
      color: 0xF5D77F, // Brilliant Metallic Gold
      metalness: 0.95,
      roughness: 0.16,
      emissive: 0x4D1D64,
      emissiveIntensity: 0.25,
    }),
    visor: visorGold,
    beacon: cyanBeacon,
    flame: flameBlue,
  }

  // ── ROBOT 2: CRIMSON ROSE-GOLD (Cultural & Dynamic Artistry) ──
  const robo2Mats = {
    suit: new THREE.MeshStandardMaterial({
      color: 0x4A0418, // Deep Cosmic Wine/Crimson
      metalness: 0.85,
      roughness: 0.24,
      emissive: 0x2E020E,
      emissiveIntensity: 0.4,
    }),
    armor: new THREE.MeshStandardMaterial({
      color: 0xFB7185, // Rose-Gold / Radiant Coral
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x9F1239,
      emissiveIntensity: 0.3,
    }),
    visor: new THREE.MeshStandardMaterial({
      color: 0xFFE4E6,
      metalness: 0.98,
      roughness: 0.08,
      emissive: 0xFB7185,
      emissiveIntensity: 0.5,
    }),
    beacon: rubyBeacon,
    flame: flameAmber,
  }

  // ── ROBOT 3: EMERALD PLATINUM (Cybernetic Analytics & Intelligence) ──
  const robo3Mats = {
    suit: new THREE.MeshStandardMaterial({
      color: 0x06282E, // Deep Cyber Teal / Slate
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x03171B,
      emissiveIntensity: 0.45,
    }),
    armor: new THREE.MeshStandardMaterial({
      color: 0x2DD4BF, // Electric Emerald / Mint Chrome
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x0F766E,
      emissiveIntensity: 0.35,
    }),
    visor: new THREE.MeshStandardMaterial({
      color: 0xCCFBF1,
      metalness: 0.98,
      roughness: 0.08,
      emissive: 0x2DD4BF,
      emissiveIntensity: 0.55,
    }),
    beacon: goldBeacon,
    flame: flameBlue,
  }

  return { robo1Mats, robo2Mats, robo3Mats }
}

/**
 * Builds a detailed Humanoid Spacewalking Astronaut Doll
 */
const buildHumanoidAstronaut = (mats, scale = 1.0) => {
  const astronaut = new THREE.Group()

  // 1. Torso Suit
  const chest = new THREE.Mesh(
    new THREE.BoxGeometry(0.7 * scale, 0.9 * scale, 0.45 * scale),
    mats.suit
  )
  chest.position.y = 0.5 * scale
  astronaut.add(chest)

  // Armor Chestplate (Colored Highlight)
  const armorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.6 * scale, 0.45 * scale, 0.12 * scale),
    mats.armor
  )
  armorPlate.position.set(0, 0.6 * scale, 0.24 * scale)
  astronaut.add(armorPlate)

  // Telemetry HUD lights on chest
  const chestLight1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.12 * scale, 0.06 * scale, 0.05 * scale),
    mats.beacon
  )
  chestLight1.position.set(-0.16 * scale, 0.65 * scale, 0.31 * scale)
  astronaut.add(chestLight1)

  const chestLight2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08 * scale, 0.06 * scale, 0.05 * scale),
    mats.beacon
  )
  chestLight2.position.set(0.16 * scale, 0.65 * scale, 0.31 * scale)
  astronaut.add(chestLight2)

  // 2. Helmet & Visor
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.38 * scale, 24, 24),
    mats.suit
  )
  helmet.position.y = 1.25 * scale
  astronaut.add(helmet)

  // Reflective Astronaut Visor
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.32 * scale, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.visor
  )
  visor.rotation.x = Math.PI / 2
  visor.position.set(0, 1.25 * scale, 0.15 * scale)
  astronaut.add(visor)

  // Helmet side antenna
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.25 * scale, 8),
    mats.armor
  )
  antenna.position.set(0.38 * scale, 1.4 * scale, 0)
  astronaut.add(antenna)

  // 3. Jetpack (PLSS)
  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.55 * scale, 0.75 * scale, 0.3 * scale),
    mats.armor
  )
  backpack.position.set(0, 0.55 * scale, -0.32 * scale)
  astronaut.add(backpack)

  // Dual Thruster nozzles
  const nozzleL = new THREE.Mesh(
    new THREE.ConeGeometry(0.09 * scale, 0.18 * scale, 12),
    mats.suit
  )
  nozzleL.rotation.x = Math.PI
  nozzleL.position.set(-0.18 * scale, 0.12 * scale, -0.32 * scale)
  astronaut.add(nozzleL)

  const nozzleR = nozzleL.clone()
  nozzleR.position.x = 0.18 * scale
  astronaut.add(nozzleR)

  // Thruster flame
  const plumeL = new THREE.Mesh(
    new THREE.ConeGeometry(0.06 * scale, 0.25 * scale, 8),
    mats.flame
  )
  plumeL.rotation.x = Math.PI
  plumeL.position.set(-0.18 * scale, -0.05 * scale, -0.32 * scale)
  astronaut.add(plumeL)

  const plumeR = plumeL.clone()
  plumeR.position.x = 0.18 * scale
  astronaut.add(plumeR)

  // 4. Arms (Floating microgravity gesture)
  const armL = new THREE.Group()
  const bicepL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11 * scale, 0.1 * scale, 0.45 * scale, 12),
    mats.armor
  )
  bicepL.position.y = -0.22 * scale
  armL.add(bicepL)

  const gloveL = new THREE.Mesh(
    new THREE.SphereGeometry(0.12 * scale, 12, 12),
    mats.suit
  )
  gloveL.position.y = -0.48 * scale
  armL.add(gloveL)

  armL.position.set(-0.48 * scale, 0.85 * scale, 0)
  armL.rotation.z = 0.5
  armL.rotation.x = -0.3
  astronaut.add(armL)

  const armR = new THREE.Group()
  const bicepR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11 * scale, 0.1 * scale, 0.45 * scale, 12),
    mats.armor
  )
  bicepR.position.y = -0.22 * scale
  armR.add(bicepR)

  const gloveR = new THREE.Mesh(
    new THREE.SphereGeometry(0.12 * scale, 12, 12),
    mats.suit
  )
  gloveR.position.y = -0.48 * scale
  armR.add(gloveR)

  armR.position.set(0.48 * scale, 0.85 * scale, 0)
  armR.rotation.z = -0.6
  armR.rotation.x = 0.4
  astronaut.add(armR)

  // 5. Legs (Floating zero-gravity stride)
  const legL = new THREE.Group()
  const thighL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.11 * scale, 0.55 * scale, 12),
    mats.suit
  )
  thighL.position.y = -0.27 * scale
  legL.add(thighL)

  const bootL = new THREE.Mesh(
    new THREE.BoxGeometry(0.18 * scale, 0.15 * scale, 0.28 * scale),
    mats.armor
  )
  bootL.position.set(0, -0.6 * scale, 0.05 * scale)
  legL.add(bootL)

  legL.position.set(-0.2 * scale, 0.05 * scale, 0)
  legL.rotation.x = 0.25
  legL.rotation.z = 0.15
  astronaut.add(legL)

  const legR = new THREE.Group()
  const thighR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.11 * scale, 0.55 * scale, 12),
    mats.suit
  )
  thighR.position.y = -0.27 * scale
  legR.add(thighR)

  const bootR = new THREE.Mesh(
    new THREE.BoxGeometry(0.18 * scale, 0.15 * scale, 0.28 * scale),
    mats.armor
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
 * Robot 1: Gold & Obsidian Commander (Spins Clockwise Yaw + Pitch)
 */
export const buildCommanderAstronaut = (materials) => {
  const group = buildHumanoidAstronaut(materials.robo1Mats, 1.0)
  group.position.set(-3.2, 1.4, -1.0)
  group.rotation.set(0.2, 0.4, -0.2)

  return {
    group,
    rotX: 0.005,
    rotY: 0.009,
    rotZ: 0.003,
    orbitR: 3.5,
    orbitY: 1.4,
    speed: 0.00035,
    phase: 0.2,
  }
}

/**
 * Robot 2: Crimson Rose-Gold Pathfinder (Spins Counter-Clockwise Roll + Inverted Yaw)
 */
export const buildExplorerAstronaut = (materials) => {
  const group = buildHumanoidAstronaut(materials.robo2Mats, 0.88)
  group.position.set(3.4, -1.2, -1.2)
  group.rotation.set(-0.3, -0.5, 0.3)

  return {
    group,
    rotX: -0.006,
    rotY: -0.008,
    rotZ: -0.005,
    orbitR: 3.8,
    orbitY: -1.2,
    speed: -0.0003,
    phase: 1.8,
  }
}

/**
 * Robot 3: Emerald Platinum Vanguard (Spins Dynamic Pitch + Wobble)
 */
export const buildScoutAstronaut = (materials) => {
  const group = buildHumanoidAstronaut(materials.robo3Mats, 0.75)
  group.position.set(-1.4, -2.6, -0.6)
  group.rotation.set(0.4, 0.2, 0.3)

  return {
    group,
    rotX: 0.007,
    rotY: -0.006,
    rotZ: 0.009,
    orbitR: 2.4,
    orbitY: -2.6,
    speed: 0.00045,
    phase: 3.5,
  }
}
