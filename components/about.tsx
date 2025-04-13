"use client"

import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { Brain, TrendingUp, Shield } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import ThreeDCard from "@/components/3d-card"
import AnimatedGradientBorder from "@/components/animated-gradient-border"
import AnimatedCounter from "@/components/animated-counter"
import ThreeDInvestmentIcons from "@/components/3d-investment-icons"
import { useScroll } from "@/components/scroll-context"
import ParallaxElement from "@/components/parallax-element"
import VectorGraphic from "@/components/vector-graphic"
import Image from "next/image"

export default function About() {
  const { scrollY } = useScroll()

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <GradientHeading>About Us</GradientHeading>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Transforming traditional investment strategies with cutting-edge AI and machine learning
            </p>
          </div>
        </ScrollReveal>

        {/* Vector Graphics with Parallax */}
        <ParallaxElement className="absolute top-20 left-5 z-0" offset={40} direction="left">
          <VectorGraphic type="wave" width={200} height={100} opacity={0.15} />
        </ParallaxElement>

        <ParallaxElement className="absolute bottom-40 right-5 z-0" offset={30} direction="right">
          <VectorGraphic type="dots" width={150} height={150} opacity={0.15} />
        </ParallaxElement>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <AnimatedGradientBorder>
              <GlassCard className="mb-12">
                <p className="text-lg text-gray-300 leading-relaxed">
                  At Walford Capitals, we harness state-of-the-art AI and machine learning to transform traditional
                  investment strategies. Our proprietary algorithms analyze complex market data to adapt swiftly to
                  modern trends. We design tailored portfolios that seamlessly blend gold, real estate, liquid assets,
                  and alternative investments, maximizing returns and minimizing risks.
                </p>
              </GlassCard>
            </AnimatedGradientBorder>
          </ScrollReveal>

          {/*<div className="my-16 relative">
            <ThreeDInvestmentIcons scrollY={scrollY} />

            <ParallaxElement
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-0"
              offset={20}
              direction="up"
            >
              <div className="w-full max-w-md mx-auto">
                <Image
                  src="/images/investment-graph.svg"
                  alt="Investment Graph"
                  width={500}
                  height={200}
                  className="opacity-20"
                />
              </div>
            </ParallaxElement>
          </div>*/}

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0.2}>
              <ThreeDCard>
                <GlassCard className="text-center h-full">
                  <div className="flex justify-center mb-4">
                    <Brain className="h-12 w-12 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered Analysis</h3>
                  <p className="text-gray-400">
                    Our algorithms process vast amounts of market data to identify opportunities others miss.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      <AnimatedCounter end={98} suffix="%" />
                      <div className="text-sm text-gray-500 mt-1">Accuracy Rate</div>
                    </div>
                  </div>
                </GlassCard>
              </ThreeDCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <ThreeDCard>
                <GlassCard className="text-center h-full">
                  <div className="flex justify-center mb-4">
                    <TrendingUp className="h-12 w-12 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Proven Results</h3>
                  <p className="text-gray-400">
                    We predicted NVIDIA's stock downfall with remarkable accuracy: Actual 16.32%, Our prediction 9.72%.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="text-2xl font-bold text-purple-500">
                      <AnimatedCounter end={35} prefix="+" suffix="%" />
                      <div className="text-sm text-gray-500 mt-1">Performance Boost</div>
                    </div>
                  </div>
                </GlassCard>
              </ThreeDCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.6}>
              <ThreeDCard>
                <GlassCard className="text-center h-full">
                  <div className="flex justify-center mb-4">
                    <Shield className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Risk Management</h3>
                  <p className="text-gray-400">
                    Our diversified approach protects your investments during market volatility.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="text-2xl font-bold text-blue-500">
                      <AnimatedCounter end={42} suffix="%" />
                      <div className="text-sm text-gray-500 mt-1">Risk Reduction</div>
                    </div>
                  </div>
                </GlassCard>
              </ThreeDCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
