"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface IsometricGridProps {
  scrollY: number
}

export default function IsometricGrid({ scrollY }: IsometricGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !containerRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw the isometric grid
    const drawIsometricGrid = () => {
      if (!ctx || !canvas || !containerRef.current) return

      const { width, height } = containerRef.current.getBoundingClientRect()

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Grid properties
      const tileSize = 40
      const gridWidth = Math.ceil(width / tileSize) + 4
      const gridHeight = Math.ceil(height / tileSize) + 4

      // Calculate grid offset based on scroll position
      const scrollOffset = scrollY * 0.1
      const offsetX = (scrollOffset % tileSize) - tileSize * 2
      const offsetY = (scrollOffset % tileSize) - tileSize * 2

      // Draw isometric grid
      for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
          // Calculate isometric coordinates
          const x = ((i - j) * tileSize) / 2 + width / 2 + offsetX
          const y = ((i + j) * tileSize) / 4 + offsetY

          // Skip tiles outside the visible area
          if (x < -tileSize || x > width + tileSize || y < -tileSize || y > height + tileSize) {
            continue
          }

          // Determine if this is a special tile (e.g., for highlighting)
          const isSpecialTile = (i + j) % 5 === 0

          // Draw the tile
          drawIsometricTile(x, y, tileSize, isSpecialTile, i, j, scrollY)
        }
      }
    }

    const drawIsometricTile = (
      x: number,
      y: number,
      size: number,
      isSpecial: boolean,
      i: number,
      j: number,
      scrollY: number,
    ) => {
      if (!ctx) return

      // Calculate height based on a sine wave pattern and position
      const baseHeight = Math.sin(i * 0.3 + j * 0.5 + scrollY * 0.01) * 10 + 10
      const height = isSpecial ? baseHeight * 1.5 : baseHeight

      // Calculate colors based on height and special status
      let topColor, leftColor, rightColor

      if (isSpecial) {
        // Cyan to purple gradient for special tiles
        const gradient = ctx.createLinearGradient(x, y - height, x, y)
        gradient.addColorStop(0, "rgba(6, 182, 212, 0.9)")
        gradient.addColorStop(1, "rgba(124, 58, 237, 0.9)")
        topColor = gradient
        leftColor = "rgba(124, 58, 237, 0.7)"
        rightColor = "rgba(6, 182, 212, 0.7)"
      } else {
        // Regular tiles with height-based color
        const intensity = Math.min(1, height / 20)
        const r = Math.floor(6 + intensity * 30)
        const g = Math.floor(182 * intensity)
        const b = Math.floor(212 * intensity)
        topColor = `rgba(${r}, ${g}, ${b}, 0.5)`
        leftColor = `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, 0.5)`
        rightColor = `rgba(${r * 0.5}, ${g * 0.5}, ${b * 0.5}, 0.5)`
      }

      // Draw the tile faces
      const halfSize = size / 2

      // Top face (diamond)
      ctx.beginPath()
      ctx.moveTo(x, y - height)
      ctx.lineTo(x + halfSize, y + halfSize / 2 - height)
      ctx.lineTo(x, y + size / 4 - height)
      ctx.lineTo(x - halfSize, y + halfSize / 2 - height)
      ctx.closePath()
      ctx.fillStyle = topColor
      ctx.fill()

      // Left face
      ctx.beginPath()
      ctx.moveTo(x - halfSize, y + halfSize / 2 - height)
      ctx.lineTo(x, y + size / 4 - height)
      ctx.lineTo(x, y + size / 4)
      ctx.lineTo(x - halfSize, y + halfSize / 2)
      ctx.closePath()
      ctx.fillStyle = leftColor
      ctx.fill()

      // Right face
      ctx.beginPath()
      ctx.moveTo(x + halfSize, y + halfSize / 2 - height)
      ctx.lineTo(x, y + size / 4 - height)
      ctx.lineTo(x, y + size / 4)
      ctx.lineTo(x + halfSize, y + halfSize / 2)
      ctx.closePath()
      ctx.fillStyle = rightColor
      ctx.fill()

      // Add wireframe outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 0.5

      // Outline top face
      ctx.beginPath()
      ctx.moveTo(x, y - height)
      ctx.lineTo(x + halfSize, y + halfSize / 2 - height)
      ctx.lineTo(x, y + size / 4 - height)
      ctx.lineTo(x - halfSize, y + halfSize / 2 - height)
      ctx.closePath()
      ctx.stroke()

      // Outline left face
      ctx.beginPath()
      ctx.moveTo(x - halfSize, y + halfSize / 2 - height)
      ctx.lineTo(x, y + size / 4 - height)
      ctx.lineTo(x, y + size / 4)
      ctx.lineTo(x - halfSize, y + halfSize / 2)
      ctx.closePath()
      ctx.stroke()

      // Outline right face
      ctx.beginPath()
      ctx.moveTo(x + halfSize, y + halfSize / 2 - height)
      ctx.lineTo(x, y + size / 4 - height)
      ctx.lineTo(x, y + size / 4)
      ctx.lineTo(x + halfSize, y + halfSize / 2)
      ctx.closePath()
      ctx.stroke()
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (isInView) {
        drawIsometricGrid()
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [scrollY, isInView])

  return (
    <div
      ref={containerRef}
      className="w-full h-[200px] relative overflow-hidden"
      style={{
        transform: isInView ? "translateZ(0)" : "translateZ(-50px)",
        opacity: isInView ? 1 : 0,
        transition: "transform 1s ease-out, opacity 1s ease-out",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
