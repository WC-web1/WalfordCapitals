"use client"

import { useState } from "react"
import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { ChevronLeft, ChevronRight, BarChart3, LineChart, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0)

  const services = [
    {
      title: "Portfolio Optimization",
      icon: <BarChart3 className="h-12 w-12 text-cyan-400" />,
      description:
        "Uses advanced machine learning algorithms and quantitative finance techniques to continuously refine and balance your investment portfolio for optimal performance.",
    },
    {
      title: "Risk Management",
      icon: <LineChart className="h-12 w-12 text-purple-500" />,
      description:
        "Employs sophisticated ML models to monitor and mitigate risks for a resilient investment strategy that can weather market volatility.",
    },
    {
      title: "Financial Planning",
      icon: <PieChart className="h-12 w-12 text-blue-500" />,
      description:
        "Integrates data-driven insights with personalized advice to secure your financial future and help you achieve your long-term goals.",
    },
  ]

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % services.length)
  }

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length)
  }

  return (
    <section id="services" className="py-20 relative bg-gradient-to-b from-slate-950 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <GradientHeading>Our Services</GradientHeading>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Cutting-edge solutions powered by AI to optimize your investment strategy
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <GlassCard key={index} className="text-center h-full flex flex-col">
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
              <p className="text-gray-400 flex-grow">{service.description}</p>
              <Button variant="link" className="text-cyan-400 mt-4">
                Learn More
              </Button>
            </GlassCard>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {services.map((service, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <GlassCard className="text-center h-full flex flex-col">
                    <div className="flex justify-center mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                    <p className="text-gray-400 flex-grow">{service.description}</p>
                    <Button variant="link" className="text-cyan-400 mt-4">
                      Learn More
                    </Button>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-500 text-cyan-400"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-500 text-cyan-400"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center mt-4">
            {services.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? "bg-cyan-400" : "bg-gray-600"}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
