"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  borderWidth?: number
  duration?: number
  borderRadius?: string
  colors?: string[]
}

export default function AnimatedGradientBorder({
  children,
  className = "",
  borderWidth = 2,
  duration = 8,
  borderRadius = "0.75rem",
  colors = ["#06b6d4", "#7c3aed", "#38bdf8", "#8b5cf6"],
}: AnimatedGradientBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const border = borderRef.current
    if (!border) return

    const updateGradient = () => {
      const angle = ((Date.now() / 1000) % duration) * (360 / duration)
      border.style.backgroundImage = `linear-gradient(${angle}deg, ${colors.join(", ")})`
    }

    const intervalId = setInterval(updateGradient, 20)
    updateGradient()

    return () => clearInterval(intervalId)
  }, [colors, duration])

  return (
    <div className="relative">
      <div
        ref={borderRef}
        className={cn("absolute inset-0 rounded-[calc(var(--radius)+2px)] z-0", className)}
        style={{
          padding: borderWidth,
          borderRadius,
          backgroundSize: "200% 200%",
        }}
      />
      <div className="relative z-10 bg-black rounded-[var(--radius)]" style={{ borderRadius }}>
        {children}
      </div>
    </div>
  )
}
