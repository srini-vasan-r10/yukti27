const scrollStore = {
  progress: 0,
  velocity: 0, // dynamic scroll speed and direction
  scrollDirection: 1, // 1 for down, -1 for up

  // Camera looking at origin
  camX: 0,   camY: 1,   camZ: 32,
  lookX: 0,  lookY: 0,  lookZ: 0,
  fov: 50,

  // Responsive position: updated dynamically on resize (desktop: -5.5, mobile: 0)
  globeX: -5.5,
  globeY: 0,

  centralScale: 1.15,
  centralRotY: 0,
  centralRotX: 0,
  centralEmissive: 0.6,
  centralWireframe: 1,
  centralEdgeGlow: 0.9,

  ring1Opacity: 0.65,
  ring2Opacity: 0.55,
  ring3Opacity: 0.45,
  ring1RotZ: 0,
  ring2RotX: 0,
  ring3RotY: 0,

  nodesVisible: 1,
  activeNode: -1,
  nodeHighlight: 0,
  connectionProgress: 0.6,

  particleSpread: 75,
  particleOpacity: 0.5,
  particleSpeed: 0.2,
  particleGoldRatio: 0.15,

  ambientIntensity: 0.4,
  goldLightIntensity: 2.2,
  goldLightX: -5.5,
  goldLightY: 5,
  goldLightZ: 10,
  spotIntensity: 1.5,
  spotTargetX: -5.5,
  spotTargetY: 0,
  spotTargetZ: 0,

  fogNear: 25,
  fogFar: 110,
  fogDensity: 0.012,
}

export default scrollStore
