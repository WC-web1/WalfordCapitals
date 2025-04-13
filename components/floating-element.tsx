"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  amplitude?: number
  period?: number
  phase?: number
}

export default function FloatingElement({
  children,
  className = "",
  amplitude = 10,
  period = 5,
  phase = 0,
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const startTime = useRef(Date.now() / 1000 + phase)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const animate = () => {
      const time = Date.now() / 1000 - startTime.current
      const offset = amplitude * Math.sin((2 * Math.PI * time) / period)

      if (element) {
        element.style.transform = `translateY(${offset}px)`
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [amplitude, period])

  return (
    <div ref={elementRef} className={cn("transition-transform", className)}>
      {children}
    </div>
  )
}
