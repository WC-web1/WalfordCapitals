"use client"

import type React from "react"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ThreeDCardProps {
  children: React.ReactNode
  className?: string
  glareOpacity?: number
  rotationIntensity?: number
}

export default function ThreeDCard({
  children,
  className = "",
  glareOpacity = 0.2,
  rotationIntensity = 10,
}: ThreeDCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calculate rotation based on mouse position
    const rotateY = (mouseX / (rect.width / 2)) * rotationIntensity
    const rotateX = -((mouseY / (rect.height / 2)) * rotationIntensity)

    setRotation({ x: rotateX, y: rotateY })

    // Calculate glare position
    const glareX = (mouseX / rect.width) * 100 + 50
    const glareY = (mouseY / rect.height) * 100 + 50
    setGlarePosition({ x: glareX, y: glareY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden transition-transform duration-200", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`
          : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
        transition: "transform 0.2s ease",
      }}
    >
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glareOpacity}), transparent 50%)`,
          }}
        />
      )}
      {children}
    </div>
  )
}
