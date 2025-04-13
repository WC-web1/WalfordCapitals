"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import * as THREE from "three"

interface ThreeDInvestmentIconsProps {
  scrollY: number
}

export default function ThreeDInvestmentIcons({ scrollY }: ThreeDInvestmentIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const [isInitialized, setIsInitialized] = useState(false)
  const iconsRef = useRef<THREE.Group[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene only once
    if (!isInitialized) {
      initScene()
      setIsInitialized(true)
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isInitialized])

  // Update based on scroll position
  useEffect(() => {
    if (!isInView || !sceneRef.current) return

    // Animate icons based on scroll position
    iconsRef.current.forEach((icon, index) => {
      if (icon) {
        // Calculate rotation based on scroll and icon index
        const rotationSpeed = 0.0005
        const scrollFactor = scrollY * rotationSpeed
        const indexOffset = index * (Math.PI / 4)

        icon.rotation.y = scrollFactor + indexOffset

        // Add some vertical movement
        const verticalOffset = Math.sin(scrollFactor * 2 + indexOffset) * 0.1
        icon.position.y = verticalOffset

        // Scale based on scroll
        const scaleFactor = 1 + Math.sin(scrollFactor * 0.5 + indexOffset) * 0.1
        icon.scale.set(scaleFactor, scaleFactor, scaleFactor)
      }
    })

    // Render the scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }, [scrollY, isInView])

  const initScene = () => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create 3D investment icons
    createInvestmentIcons()

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Initial render
    renderer.render(scene, camera)
  }

  const createInvestmentIcons = () => {
    if (!sceneRef.current) return

    // Create geometric shapes representing investment types
    const iconPositions = [
      new THREE.Vector3(-2, 0, 0), // Stock/Chart
      new THREE.Vector3(0, 0, 0), // Real Estate/House
      new THREE.Vector3(2, 0, 0), // Gold/Coin
    ]

    // Stock/Chart icon (cube with lines)
    const stockIcon = createStockIcon()
    stockIcon.position.copy(iconPositions[0])
    sceneRef.current.add(stockIcon)
    iconsRef.current.push(stockIcon)

    // Real Estate icon (house shape)
    const realEstateIcon = createRealEstateIcon()
    realEstateIcon.position.copy(iconPositions[1])
    sceneRef.current.add(realEstateIcon)
    iconsRef.current.push(realEstateIcon)

    // Gold icon (coin)
    const goldIcon = createGoldIcon()
    goldIcon.position.copy(iconPositions[2])
    sceneRef.current.add(goldIcon)
    iconsRef.current.push(goldIcon)
  }

  const createStockIcon = () => {
    const group = new THREE.Group()

    // Base cube
    const geometry = new THREE.BoxGeometry(1, 1, 0.1)
    const material = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.2,
    })
    const cube = new THREE.Mesh(geometry, material)
    group.add(cube)

    // Add chart lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

    // Create a zigzag line for the chart
    const points = []
    const numPoints = 10
    const width = 0.8
    const height = 0.8

    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * width - width / 2
      // Create a zigzag pattern
      const y = Math.sin(i * 0.8) * 0.2 + (i / numPoints) * 0.3 - 0.2
      points.push(new THREE.Vector3(x, y, 0.06))
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(lineGeometry, lineMaterial)
    group.add(line)

    return group
  }

  const createRealEstateIcon = () => {
    const group = new THREE.Group()

    // House base
    const baseGeometry = new THREE.BoxGeometry(1, 0.6, 0.8)
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.8,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.2,
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = -0.2
    group.add(base)

    // Roof
    const roofGeometry = new THREE.ConeGeometry(0.7, 0.5, 4)
    const roofMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.9,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.2,
    })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.y = 0.35
    roof.rotation.y = Math.PI / 4
    group.add(roof)

    // Door
    const doorGeometry = new THREE.PlaneGeometry(0.2, 0.3)
    const doorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.set(0, -0.25, 0.41)
    group.add(door)

    // Windows
    const windowGeometry = new THREE.PlaneGeometry(0.15, 0.15)
    const windowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

    const window1 = new THREE.Mesh(windowGeometry, windowMaterial)
    window1.position.set(-0.25, -0.15, 0.41)
    group.add(window1)

    const window2 = new THREE.Mesh(windowGeometry, windowMaterial)
    window2.position.set(0.25, -0.15, 0.41)
    group.add(window2)

    return group
  }

  const createGoldIcon = () => {
    const group = new THREE.Group()

    // Coin base
    const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32)
    const coinMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0.2,
      emissive: 0xffd700,
      emissiveIntensity: 0.2,
    })
    const coin = new THREE.Mesh(coinGeometry, coinMaterial)
    coin.rotation.x = Math.PI / 2
    group.add(coin)

    // Instead of using TextGeometry (which requires font loading),
    // we'll create a dollar sign using simple shapes
    const dollarShape = new THREE.Group()

    // Vertical line
    const lineGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8)
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const line = new THREE.Mesh(lineGeometry, lineMaterial)
    dollarShape.add(line)

    // Top curve
    const topCurveGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 8, Math.PI)
    const topCurve = new THREE.Mesh(topCurveGeometry, lineMaterial)
    topCurve.position.y = 0.15
    topCurve.position.x = -0.08
    topCurve.rotation.z = Math.PI / 2
    dollarShape.add(topCurve)

    // Bottom curve
    const bottomCurveGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 8, Math.PI)
    const bottomCurve = new THREE.Mesh(bottomCurveGeometry, lineMaterial)
    bottomCurve.position.y = -0.15
    bottomCurve.position.x = 0.08
    bottomCurve.rotation.z = -Math.PI / 2
    dollarShape.add(bottomCurve)

    dollarShape.position.z = 0.06
    group.add(dollarShape)

    return group
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] relative"
      style={{
        transform: isInView ? "translateZ(0) rotateX(0deg)" : "translateZ(-100px) rotateX(20deg)",
        opacity: isInView ? 1 : 0,
        transition: "transform 1s ease-out, opacity 1s ease-out",
      }}
    />
  )
}
