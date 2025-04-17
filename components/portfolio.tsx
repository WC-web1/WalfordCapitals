"use client"

import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, TrendingUp, PieChart } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import AnimatedChart from "@/components/animated-chart"
import AnimatedGradientBorder from "@/components/animated-gradient-border"
import NeuralNetwork from "@/components/3d-neural-network"
import IsometricGrid from "@/components/3d-isometric-grid"
import { useScroll } from "@/components/scroll-context"
import ParallaxElement from "@/components/parallax-element"
import VectorGraphic from "@/components/vector-graphic"
import Image from "next/image"

export default function Portfolio() {
  const { scrollY } = useScroll()

  return (
    <section id="portfolio" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <GradientHeading>Portfolio Optimization</GradientHeading>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Our approach leverages advanced ML algorithms and quantitative finance techniques
            </p>
          </div>
        </ScrollReveal>

        {/* Vector Graphics with Parallax */}
        <ParallaxElement className="absolute top-40 right-10 z-0" offset={50} direction="right">
          <VectorGraphic type="circuit" width={250} height={250} opacity={0.15} />
        </ParallaxElement>

        <ParallaxElement className="absolute bottom-20 left-10 z-0" offset={40} direction="left">
          <VectorGraphic type="abstract" width={200} height={200} opacity={0.15} />
        </ParallaxElement>

        <div className="mb-16 relative">
          <NeuralNetwork scrollY={scrollY} />

          
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <ScrollReveal direction="left">
            <AnimatedGradientBorder>
              <GlassCard>
                <h3 className="text-2xl font-semibold mb-4 text-white">Advanced Algorithms</h3>
                <p className="text-gray-300 mb-6">
                  Our approach leverages advanced ML algorithms and quantitative finance techniques to achieve results
                  that were deemed impossible just a decade ago.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <BarChart2 className="h-5 w-5 text-cyan-400 mr-3 mt-1" />
                    <p className="text-gray-400">Dynamic portfolio rebalancing based on real-time market conditions</p>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-cyan-400 mr-3 mt-1" />
                    <p className="text-gray-400">Predictive analytics for emerging market trends</p>
                  </div>
                  <div className="flex items-start">
                    <PieChart className="h-5 w-5 text-cyan-400 mr-3 mt-1" />
                    <p className="text-gray-400">Robust diversification across traditional and alternative assets</p>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </GlassCard>
            </AnimatedGradientBorder>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.3}>
            <GlassCard className="overflow-hidden">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-cyan-500/20 to-transparent p-2 rounded-bl-lg text-xs font-medium text-cyan-300">
                  NVIDIA Stock Prediction
                </div>
                <AnimatedChart />
                <div className="mt-4 text-gray-400 text-sm">
                  Our AI algorithms successfully predicted NVIDIA's stock downfall with remarkable accuracy. While the
                  actual drop was 16.32%, our model predicted a 9.72% decline, demonstrating our capability to
                  anticipate market trends with precision.
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        <div className="mt-16 relative">
       

          
        </div>
      </div>
    </section>
  )
}
