"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface NeuralNetworkProps {
  scrollY: number
}

export default function NeuralNetwork({ scrollY }: NeuralNetworkProps) {
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

    // Neural network properties
    const layers = [4, 8, 12, 8, 4] // Number of neurons in each layer
    const neuronRadius = 8
    const layerSpacing = 150

    // Create neurons
    const neurons: { x: number; y: number; layer: number; index: number }[] = []

    const initNeurons = () => {
      neurons.length = 0

      if (!canvas || !containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()

      const startX = width / 2 - ((layers.length - 1) * layerSpacing) / 2

      layers.forEach((neuronCount, layerIndex) => {
        const layerHeight = neuronCount * neuronRadius * 3
        const startY = height / 2 - layerHeight / 2

        for (let i = 0; i < neuronCount; i++) {
          neurons.push({
            x: startX + layerIndex * layerSpacing,
            y: startY + i * neuronRadius * 3,
            layer: layerIndex,
            index: i,
          })
        }
      })
    }

    initNeurons()

    // Draw the neural network
    const drawNeuralNetwork = () => {
      if (!ctx || !canvas || !containerRef.current) return

      const { width, height } = containerRef.current.getBoundingClientRect()

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate perspective shift based on scroll
      const perspectiveShift = Math.sin(scrollY * 0.001) * 50

      // Draw connections first (so they appear behind neurons)
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]

        // Connect to all neurons in the next layer
        if (neuron.layer < layers.length - 1) {
          const nextLayerStart = layers.slice(0, neuron.layer).reduce((sum, count) => sum + count, 0)
          const nextLayerSize = layers[neuron.layer + 1]

          for (let j = 0; j < nextLayerSize; j++) {
            const targetNeuron = neurons[nextLayerStart + j]

            // Calculate activation based on time and position
            const time = Date.now() * 0.001
            const activation = Math.sin(time + neuron.index * 0.5 + targetNeuron.index * 0.3) * 0.5 + 0.5

            // Draw connection with gradient based on activation
            const gradient = ctx.createLinearGradient(neuron.x, neuron.y, targetNeuron.x, targetNeuron.y)

            gradient.addColorStop(0, `rgba(6, 182, 212, ${activation * 0.7})`)
            gradient.addColorStop(1, `rgba(124, 58, 237, ${activation * 0.7})`)

            ctx.beginPath()
            ctx.moveTo(neuron.x + perspectiveShift * (neuron.layer / (layers.length - 1)), neuron.y)
            ctx.lineTo(targetNeuron.x + perspectiveShift * (targetNeuron.layer / (layers.length - 1)), targetNeuron.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = activation * 2 + 0.5
            ctx.stroke()

            // Draw pulse animation along the connection
            const pulsePosition = (time * 0.5 + neuron.index * 0.1 + targetNeuron.index * 0.05) % 1
            const pulseX =
              neuron.x +
              (targetNeuron.x - neuron.x) * pulsePosition +
              perspectiveShift * ((neuron.layer + pulsePosition) / (layers.length - 1))
            const pulseY = neuron.y + (targetNeuron.y - neuron.y) * pulsePosition

            ctx.beginPath()
            ctx.arc(pulseX, pulseY, activation * 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${activation * 0.8})`
            ctx.fill()
          }
        }
      }

      // Draw neurons
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]

        // Apply perspective shift based on layer
        const x = neuron.x + perspectiveShift * (neuron.layer / (layers.length - 1))

        // Calculate activation based on time and position
        const time = Date.now() * 0.001
        const activation = Math.sin(time + neuron.index * 0.2 + neuron.layer * 0.5) * 0.5 + 0.5

        // Draw neuron glow
        const glowRadius = neuronRadius + activation * 5
        const gradient = ctx.createRadialGradient(x, neuron.y, 0, x, neuron.y, glowRadius * 2)

        // Color based on layer position (cyan to purple)
        const colorPos = neuron.layer / (layers.length - 1)
        const r = Math.floor(6 + colorPos * 118)
        const g = Math.floor(182 - colorPos * 124)
        const b = Math.floor(212 + colorPos * 25)

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.3)`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.beginPath()
        ctx.arc(x, neuron.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw neuron core
        ctx.beginPath()
        ctx.arc(x, neuron.y, neuronRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 + activation * 0.5})`
        ctx.fill()

        // Draw neuron outline
        ctx.beginPath()
        ctx.arc(x, neuron.y, neuronRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (isInView) {
        drawNeuralNetwork()
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    window.addEventListener("resize", () => {
      setCanvasDimensions()
      initNeurons()
    })

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [scrollY, isInView])

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] relative overflow-hidden"
      style={{
        transform: isInView ? "translateZ(0) rotateX(0deg)" : "translateZ(-50px) rotateX(10deg)",
        opacity: isInView ? 1 : 0,
        transition: "transform 1s ease-out, opacity 1s ease-out",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
