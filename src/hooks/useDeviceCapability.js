import { useMemo } from 'react'

export default function useDeviceCapability() {
  return useMemo(() => {
    let tier = 'high'
    let webgl = true
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) {
        tier = 'none'
        webgl = false
      } else {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        if (isMobile) tier = 'medium'
      }
      canvas.remove()
    } catch {
      tier = 'medium'
    }

    const reducedMotion = typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false

    return {
      tier,
      webgl,
      particleCount: tier === 'high' ? 2200 : tier === 'medium' ? 1200 : 500,
      dpr: tier === 'high' ? [1, 2] : [1, 1.5],
      reducedMotion,
    }
  }, [])
}
