"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import * as THREE from "three"
import { useTheme } from "next-themes"

export default function ThreeDGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const pointsRef = useRef<THREE.Points | null>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const [isInitialized, setIsInitialized] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

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

    // Animation loop
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (globeRef.current && isInView) {
        globeRef.current.rotation.y += 0.001
      }

      if (pointsRef.current && isInView) {
        pointsRef.current.rotation.y += 0.0015
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [isInView, isInitialized])

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

    // Globe
    const globeGeometry = new THREE.SphereGeometry(1.5, 64, 64)

    // Create a shader material for the globe
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#06b6d4") }, // cyan
        color2: { value: new THREE.Color("#7c3aed") }, // purple
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          // Create a gradient based on the normal
          float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          
          // Mix colors based on position and time
          vec3 color = mix(color1, color2, vUv.y + sin(time * 0.001 + vUv.x * 10.0) * 0.1);
          
          // Add grid pattern
          float grid = 0.05;
          float line = max(
            step(mod(vUv.x * 20.0, 1.0), grid),
            step(mod(vUv.y * 10.0, 1.0), grid)
          );
          
          // Apply grid and rim lighting
          color = mix(color, vec3(1.0), line * 0.3);
          color = mix(color, vec3(1.0), intensity);
          
          gl_FragColor = vec4(color, 0.9);
        }
      `,
      transparent: true,
      wireframe: false,
    })

    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)
    globeRef.current = globe

    // Add data points around the globe
    const pointsGeometry = new THREE.BufferGeometry()
    const pointsCount = 1000
    const positions = new Float32Array(pointsCount * 3)
    const sizes = new Float32Array(pointsCount)
    const colors = new Float32Array(pointsCount * 3)

    const color1 = new THREE.Color("#06b6d4")
    const color2 = new THREE.Color("#7c3aed")

    for (let i = 0; i < pointsCount; i++) {
      // Create points in a spherical distribution
      const radius = 1.8 + Math.random() * 0.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Random size
      sizes[i] = Math.random() * 0.05 + 0.01

      // Gradient color based on position
      const mixFactor = Math.random()
      const pointColor = color1.clone().lerp(color2, mixFactor)
      colors[i * 3] = pointColor.r
      colors[i * 3 + 1] = pointColor.g
      colors[i * 3 + 2] = pointColor.b
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: new THREE.TextureLoader().load("/point.png") },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Animate size based on time
          float animatedSize = size * (1.0 + 0.3 * sin(time * 0.001 + position.x + position.y));
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = animatedSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    scene.add(points)
    pointsRef.current = points

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Animation loop for shader uniforms
    const clock = new THREE.Clock()

    function updateUniforms() {
      const elapsedTime = clock.getElapsedTime()

      if (globeMaterial.uniforms) {
        globeMaterial.uniforms.time.value = elapsedTime
      }

      if (pointsMaterial.uniforms) {
        pointsMaterial.uniforms.time.value = elapsedTime
      }

      requestAnimationFrame(updateUniforms)
    }

    updateUniforms()
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] relative"
      style={{
        transform: isInView ? "translateZ(0)" : "translateZ(-100px)",
        opacity: isInView ? 1 : 0,
        transition: "transform 1s ease-out, opacity 1s ease-out",
      }}
    />
  )
}
