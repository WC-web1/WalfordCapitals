"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import TypingEffect from "@/components/typing-effect"
import FloatingElement from "@/components/floating-element"
import ScrollReveal from "@/components/scroll-reveal"
import PerspectiveText from "@/components/3d-perspective-text"
import { useScroll } from "@/components/scroll-context"
import ParallaxElement from "@/components/parallax-element"
import VectorGraphic from "@/components/vector-graphic"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const { left, top, width, height } = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height

      heroRef.current.style.setProperty("--x", `${x}`)
      heroRef.current.style.setProperty("--y", `${y}`)
    }

    const element = heroRef.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(15,23,42,0.8))",
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_calc(50%+var(--x,0)*30vw)_calc(50%+var(--y,0)*30vh),rgba(56,189,248,0.15),transparent_40vw)]"></div>
      </div>

      {/* Vector Graphics with Parallax */}
      <ParallaxElement className="absolute top-20 left-10 md:left-20 z-0" offset={100} direction="left">
        <VectorGraphic type="circuit" width={300} height={300} opacity={0.15} />
      </ParallaxElement>

      <ParallaxElement className="absolute bottom-20 right-10 md:right-20 z-0" offset={80} direction="right">
        <VectorGraphic type="abstract" width={250} height={250} opacity={0.15} />
      </ParallaxElement>

      <ParallaxElement className="absolute top-1/4 right-10 md:right-40 z-0" offset={60} direction="up">
        <VectorGraphic type="dots" width={200} height={200} opacity={0.15} />
      </ParallaxElement>

      <ParallaxElement className="absolute bottom-1/4 left-10 md:left-40 z-0" offset={70} direction="down">
        <VectorGraphic type="grid" width={180} height={180} opacity={0.15} />
      </ParallaxElement>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <PerspectiveText text="AI-Powered" scrollY={scrollY} className="mb-2" />

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              <TypingEffect text="Portfolio Optimization" speed={70} />
              <br />
              <span className="inline-block mt-2">for Modern Investors</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <p className="text-xl text-gray-300 mb-8">
              Harness the power of advanced AI algorithms to maximize returns and minimize risks in your investment
              portfolio.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <div className="flex justify-center">
              <a href="#contact" className="inline-block">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-lg px-8 py-6 relative overflow-hidden group">
                  <span className="relative z-10">Contact Us</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </a>
            </div>
          </ScrollReveal>

          <FloatingElement className="mt-16" amplitude={15} period={4}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M12 19L19 12M12 19L5 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </FloatingElement>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </section>
  )
}
