import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import scrollStore from '../store/scrollStore'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollManager({ containerRef }) {
  useEffect(() => {
    if (!containerRef.current) return

    let lastScrollY = window.scrollY
    let targetVelocity = 0
    let velocityDamping = 0.88

    // Velocity & Direction tracking loop
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const deltaY = currentScrollY - lastScrollY
      
      // Determine direction: positive = scrolling down (clockwise), negative = scrolling up (anticlockwise)
      // Velocity is proportional to scroll speed
      targetVelocity = deltaY * 1.5

      scrollStore.scrollDirection = deltaY >= 0 ? 1 : -1
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Smoothly decay velocity back to 0 when scrolling stops
    let animId
    const updateVelocity = () => {
      scrollStore.velocity += (targetVelocity - scrollStore.velocity) * 0.25
      targetVelocity *= velocityDamping // decay
      animId = requestAnimationFrame(updateVelocity)
    }
    animId = requestAnimationFrame(updateVelocity)

    // Master Timeline Scrubbing
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          scrollStore.progress = self.progress
        }
      }
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animId)
      masterTl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [containerRef])

  return null
}
