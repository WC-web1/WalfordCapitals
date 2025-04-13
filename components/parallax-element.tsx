"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { useScroll } from "@/components/scroll-context"

interface ParallaxElementProps {
  children: ReactNode
  offset?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export default function ParallaxElement({
  children,
  offset = 50,
  className = "",
  direction = "up",
}: ParallaxElementProps) {
  const { scrollY } = useScroll()
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")

  useEffect(() => {
    const calculateParallax = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate how far the element is from the viewport center
      const distanceFromCenter = elementTop + elementHeight / 2 - (scrollY + windowHeight / 2)

      // Calculate a parallax factor (0 when element is centered in viewport)
      const parallaxFactor = distanceFromCenter / (windowHeight / 2)

      // Apply different transforms based on direction
      const parallaxOffset = parallaxFactor * offset

      let transformValue = ""
      switch (direction) {
        case "up":
          transformValue = `translateY(${parallaxOffset}px)`
          break
        case "down":
          transformValue = `translateY(${-parallaxOffset}px)`
          break
        case "left":
          transformValue = `translateX(${parallaxOffset}px)`
          break
        case "right":
          transformValue = `translateX(${-parallaxOffset}px)`
          break
        default:
          transformValue = `translateY(${parallaxOffset}px)`
      }

      setTransform(transformValue)
    }

    calculateParallax()

    // Clean up event listener
    return () => {
      // No event listeners to clean up in this simplified version
    }
  }, [scrollY, offset, direction])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}
