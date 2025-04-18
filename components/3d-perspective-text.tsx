"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface PerspectiveTextProps {
  text: string
  scrollY?: number // Made optional since we won't use it
  className?: string
}

export default function PerspectiveText({ text, scrollY, className = "" }: PerspectiveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !isInView) return

    let lastTime = 0
    const fps = 60

    // Animation loop that runs continuously
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const deltaTime = timestamp - lastTime

      // Update at desired frame rate
      if (deltaTime > 1000 / fps) {
        setTime((prev) => prev + 0.01) // Increment time for animations
        lastTime = timestamp
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start the animation loop
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isInView])

  useEffect(() => {
    if (!containerRef.current || !isInView) return

    const container = containerRef.current
    const letters = container.querySelectorAll(".perspective-letter")

    // Update perspective based on time
    letters.forEach((letter, index) => {
      const element = letter as HTMLElement

      // Calculate rotation and translation based on letter position and time
      // More subtle rotation for a professional look
      const rotateY = Math.sin(time * Math.PI + index * 0.2) * 15
      const rotateX = Math.cos(time * Math.PI + index * 0.2) * 8
      const translateZ = Math.sin(time * Math.PI + index * 0.1) * 10

      // Apply transformations
      element.style.transform = `
        rotateY(${rotateY}deg) 
        rotateX(${rotateX}deg) 
        translateZ(${translateZ}px)
      `

      // Tron Legacy inspired glow effect - pulsing blue glow
      const pulseIntensity = Math.sin(time * 3 + index * 0.5) * 0.5 + 0.5

      // Professional color scheme - deep blues and cyans with subtle variation
      const baseHue = 210 // Blue base
      const hueVariation = (index * 3 + time * 10) % 20 // Subtle variation with time
      const hue = baseHue + hueVariation

      // Set the color and glow based on the pulse
      element.style.color = `hsl(${hue}, 80%, ${60 + pulseIntensity * 20}%)`
      element.style.textShadow = `
        0 0 ${5 + pulseIntensity * 10}px hsl(${hue}, 100%, 70%),
        0 0 ${10 + pulseIntensity * 15}px hsl(${hue + 10}, 100%, 60%)
      `

      // Add border glow for Tron effect
      element.style.borderBottom = `1px solid hsla(${hue + 20}, 100%, ${70 + pulseIntensity * 30}%, ${0.3 + pulseIntensity * 0.7})`
    })

    // Add scanning line effect (Tron-style) - continuous movement
    const scanLine = container.querySelector(".scan-line") as HTMLElement
    if (scanLine) {
      const scanProgress = (time % 3) / 3 // Complete cycle every 3 time units
      scanLine.style.left = `${scanProgress * 100}%`
      scanLine.style.opacity = `${Math.sin(scanProgress * Math.PI) * 0.7 + 0.3}`
    }
  }, [time, isInView, text])

  return (
    <div
      ref={containerRef}
      className={`perspective-text-container relative ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        opacity: isInView ? 1 : 0,
        transition: "opacity 1s ease-out",
      }}
    >
      <div className="flex justify-center items-center">
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className="perspective-letter inline-block transition-transform duration-500 text-4xl md:text-6xl font-bold"
            style={{
              transformStyle: "preserve-3d",
              transform: `
                rotateY(${Math.sin(index) * 15}deg) 
                rotateX(${Math.cos(index) * 8}deg) 
                translateZ(${Math.sin(index) * 10}px)
              `,
              margin: "0 2px",
              padding: "0 2px",
              borderBottom: "1px solid rgba(0, 180, 250, 0.3)",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>

      {/* Tron-style scanning line */}
      <div
        className="scan-line absolute top-0 bottom-0 w-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,180,250,0) 0%, rgba(0,210,255,0.8) 50%, rgba(0,180,250,0) 100%)",
          boxShadow: "0 0 15px rgba(0,210,255,0.8), 0 0 30px rgba(0,210,255,0.6)",
          left: "0%",
        }}
      ></div>

      {/* Tron-style grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,150,220,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,150,220,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>
    </div>
  )
}
