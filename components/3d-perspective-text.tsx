"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface PerspectiveTextProps {
  text: string
  scrollY: number
  className?: string
}

export default function PerspectiveText({ text, scrollY, className = "" }: PerspectiveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  useEffect(() => {
    if (!containerRef.current || !isInView) return

    const container = containerRef.current
    const letters = container.querySelectorAll(".perspective-letter")

    // Update perspective based on scroll position
    letters.forEach((letter, index) => {
      const element = letter as HTMLElement
      const progress = (scrollY % 1000) / 1000

      // Calculate rotation and translation based on letter position and scroll
      const rotateY = Math.sin(progress * Math.PI * 2 + index * 0.2) * 30
      const rotateX = Math.cos(progress * Math.PI * 2 + index * 0.2) * 15
      const translateZ = Math.sin(progress * Math.PI * 2 + index * 0.1) * 20

      // Apply transformations
      element.style.transform = `
        rotateY(${rotateY}deg) 
        rotateX(${rotateX}deg) 
        translateZ(${translateZ}px)
      `

      // Calculate color based on rotation
      const hue = (index * 10 + scrollY * 0.05) % 360
      element.style.color = `hsl(${hue}, 80%, 60%)`
      element.style.textShadow = `0 0 10px hsl(${hue}, 80%, 60%, 0.5)`
    })
  }, [scrollY, isInView, text])

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
                rotateY(${Math.sin(index) * 30}deg) 
                rotateX(${Math.cos(index) * 15}deg) 
                translateZ(${Math.sin(index) * 20}px)
              `,
              margin: "0 2px",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </div>
  )
}
