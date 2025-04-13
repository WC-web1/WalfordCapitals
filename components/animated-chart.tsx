"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

export default function AnimatedChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const isInView = useInView(containerRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView || isAnimating) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Generate data points for the chart
    const generateData = () => {
      const points = []
      const numPoints = 100
      const predictionIndex = Math.floor(numPoints * 0.7) // Point where prediction starts
      const actualDropIndex = Math.floor(numPoints * 0.8) // Point where actual drop starts

      // Start with a value
      let value = 50 + Math.random() * 20

      // Generate initial upward trend (NVIDIA's rise)
      for (let i = 0; i < predictionIndex; i++) {
        // Add some randomness but with an upward bias
        const change = (Math.random() - 0.3) * 3
        value += change

        // Ensure value stays within reasonable bounds
        value = Math.max(30, Math.min(80, value))

        points.push({
          x: (i / (numPoints - 1)) * canvas.width,
          y: canvas.height - (value / 100) * canvas.height,
          value: value,
        })
      }

      // Store the peak value before the drop
      const peakValue = value

      // Generate our prediction line (9.72% drop)
      const predictionPoints = []
      let predictionValue = peakValue
      for (let i = predictionIndex; i < numPoints; i++) {
        // Calculate how far we are through the prediction (0 to 1)
        const dropProgress = (i - predictionIndex) / (numPoints - predictionIndex)

        // Target a 9.72% drop by the end
        const targetDrop = peakValue * 0.0972
        const currentDrop = targetDrop * dropProgress

        predictionValue = peakValue - currentDrop

        predictionPoints.push({
          x: (i / (numPoints - 1)) * canvas.width,
          y: canvas.height - (predictionValue / 100) * canvas.height,
          value: predictionValue,
        })
      }

      // Generate the actual drop line (16.32% drop)
      for (let i = actualDropIndex; i < numPoints; i++) {
        // Calculate how far we are through the actual drop (0 to 1)
        const dropProgress = (i - actualDropIndex) / (numPoints - actualDropIndex)

        // Target a 16.32% drop by the end
        const targetDrop = peakValue * 0.1632
        const currentDrop = targetDrop * dropProgress

        value = peakValue - currentDrop

        points.push({
          x: (i / (numPoints - 1)) * canvas.width,
          y: canvas.height - (value / 100) * canvas.height,
          value: value,
        })
      }

      return {
        mainLine: points.slice(0, actualDropIndex),
        actualLine: points.slice(actualDropIndex),
        predictionLine: predictionPoints,
        peakValue,
      }
    }

    const { mainLine, actualLine, predictionLine, peakValue } = generateData()

    // Draw the chart with animation
    const drawChart = (progress: number) => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
      ctx.lineWidth = 1

      for (let i = 0; i < 5; i++) {
        const y = i * (canvas.height / 4)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      for (let i = 0; i < 6; i++) {
        const x = i * (canvas.width / 5)
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Calculate points to draw based on animation progress
      const mainPointsToDraw = Math.floor(mainLine.length * Math.min(progress * 1.5, 1))
      const predictionPointsToDraw = progress > 0.6 ? Math.floor(predictionLine.length * ((progress - 0.6) / 0.4)) : 0
      const actualPointsToDraw = progress > 0.7 ? Math.floor(actualLine.length * ((progress - 0.7) / 0.3)) : 0

      // Draw the main chart line (before the drop)
      if (mainPointsToDraw > 1) {
        ctx.beginPath()
        ctx.moveTo(mainLine[0].x, mainLine[0].y)

        for (let i = 1; i < mainPointsToDraw; i++) {
          ctx.lineTo(mainLine[i].x, mainLine[i].y)
        }

        // Create gradient for the line
        const mainGradient = ctx.createLinearGradient(0, 0, canvas.width * 0.7, 0)
        mainGradient.addColorStop(0, "#06b6d4")
        mainGradient.addColorStop(1, "#0ea5e9")

        ctx.strokeStyle = mainGradient
        ctx.lineWidth = 3
        ctx.stroke()

        // Add glow effect
        ctx.shadowColor = "#06b6d4"
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw the area under the curve
        ctx.lineTo(mainLine[mainPointsToDraw - 1].x, canvas.height)
        ctx.lineTo(mainLine[0].x, canvas.height)
        ctx.closePath()

        const areaGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        areaGradient.addColorStop(0, "rgba(6, 182, 212, 0.2)")
        areaGradient.addColorStop(1, "rgba(6, 182, 212, 0)")

        ctx.fillStyle = areaGradient
        ctx.fill()
      }

      // Draw prediction line (dashed)
      if (predictionPointsToDraw > 1 && mainPointsToDraw >= mainLine.length) {
        ctx.beginPath()
        ctx.moveTo(mainLine[mainLine.length - 1].x, mainLine[mainLine.length - 1].y)

        for (let i = 0; i < predictionPointsToDraw; i++) {
          ctx.lineTo(predictionLine[i].x, predictionLine[i].y)
        }

        ctx.setLineDash([5, 3])
        ctx.strokeStyle = "#0ea5e9"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.setLineDash([])

        // Add prediction label if fully drawn
        if (predictionPointsToDraw >= predictionLine.length) {
          const endX = predictionLine[predictionLine.length - 1].x
          const endY = predictionLine[predictionLine.length - 1].y

          ctx.fillStyle = "#0ea5e9"
          ctx.beginPath()
          ctx.arc(endX, endY, 4, 0, Math.PI * 2)
          ctx.fill()

          ctx.font = "12px sans-serif"
          ctx.fillStyle = "#0ea5e9"
          ctx.textAlign = "right"
          ctx.fillText("Predicted: -9.72%", endX - 10, endY - 10)
        }
      }

      // Draw actual line (solid)
      if (actualPointsToDraw > 1 && mainPointsToDraw >= mainLine.length) {
        ctx.beginPath()
        ctx.moveTo(mainLine[mainLine.length - 1].x, mainLine[mainLine.length - 1].y)

        for (let i = 0; i < actualPointsToDraw; i++) {
          ctx.lineTo(actualLine[i].x, actualLine[i].y)
        }

        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 3
        ctx.stroke()

        // Add actual label if fully drawn
        if (actualPointsToDraw >= actualLine.length) {
          const endX = actualLine[actualLine.length - 1].x
          const endY = actualLine[actualLine.length - 1].y

          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(endX, endY, 4, 0, Math.PI * 2)
          ctx.fill()

          ctx.font = "12px sans-serif"
          ctx.fillStyle = "#ef4444"
          ctx.textAlign = "right"
          ctx.fillText("Actual: -16.32%", endX - 10, endY - 10)
        }
      }

      // Draw peak marker
      if (progress > 0.6 && mainPointsToDraw >= mainLine.length) {
        const peakX = mainLine[mainLine.length - 1].x
        const peakY = mainLine[mainLine.length - 1].y

        ctx.beginPath()
        ctx.arc(peakX, peakY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#fbbf24"
        ctx.fill()

        ctx.font = "12px sans-serif"
        ctx.fillStyle = "#fbbf24"
        ctx.textAlign = "center"
        ctx.fillText("Peak", peakX, peakY - 10)
      }

      // Draw legend
      if (progress > 0.8) {
        const legendOpacity = (progress - 0.8) / 0.2
        const legendX = 20
        const legendY = 30
        const legendSpacing = 20

        ctx.globalAlpha = legendOpacity

        // Main line
        ctx.beginPath()
        ctx.moveTo(legendX, legendY)
        ctx.lineTo(legendX + 30, legendY)
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.font = "12px sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.textAlign = "left"
        ctx.fillText("NVIDIA Stock", legendX + 40, legendY + 4)

        // Prediction line
        ctx.beginPath()
        ctx.moveTo(legendX, legendY + legendSpacing)
        ctx.lineTo(legendX + 30, legendY + legendSpacing)
        ctx.setLineDash([5, 3])
        ctx.strokeStyle = "#0ea5e9"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillText("Our Prediction (-9.72%)", legendX + 40, legendY + legendSpacing + 4)

        // Actual line
        ctx.beginPath()
        ctx.moveTo(legendX, legendY + legendSpacing * 2)
        ctx.lineTo(legendX + 30, legendY + legendSpacing * 2)
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.fillText("Actual Drop (-16.32%)", legendX + 40, legendY + legendSpacing * 2 + 4)

        ctx.globalAlpha = 1.0
      }
    }

    // Animate the chart
    setIsAnimating(true)
    let startTime: number | null = null
    const duration = 3000 // 3 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      drawChart(progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [isInView, isAnimating])

  return (
    <div ref={containerRef} className="w-full h-64 relative rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
