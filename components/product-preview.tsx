"use client"

import { useState, useRef, useEffect } from "react"
import GradientHeading from "@/components/gradient-heading"
import GlassCard from "@/components/glass-card"
import ScrollReveal from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { Zap, Star, Users, TrendingUp, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import TradingBotDemo from "@/components/trading-bot-demo"
import FloatingElement from "@/components/floating-element"

// Testimonials
const testimonials = [
  {
    quote: "The AI predictions are uncannily accurate. I've seen a 27% increase in my portfolio since using the beta.",
    author: "Michael R., Investment Analyst",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    quote:
      "Finally, a trading platform that makes sense of market chaos. The risk management features saved me during the last correction.",
    author: "Sarah L., Day Trader",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    quote: "As someone new to investing, the AI guidance feels like having a professional advisor by my side 24/7.",
    author: "David K., New Investor",
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

// Stats
const stats = [
  { value: "93%", label: "Prediction Accuracy", icon: <Star className="h-5 w-5 text-yellow-400" /> },
  { value: "12,500+", label: "Beta Users", icon: <Users className="h-5 w-5 text-cyan-400" /> },
  { value: "+31%", label: "Average Returns", icon: <TrendingUp className="h-5 w-5 text-green-400" /> },
  { value: "-42%", label: "Risk Reduction", icon: <Shield className="h-5 w-5 text-purple-400" /> },
]

export default function ProductPreview() {
  const [showDemo, setShowDemo] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonialTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-advance testimonials
  useEffect(() => {
    testimonialTimerRef.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)

    return () => {
      if (testimonialTimerRef.current) {
        clearInterval(testimonialTimerRef.current)
      }
    }
  }, [])

  const toggleDemo = () => {
    setShowDemo(!showDemo)
  }

  return (
    <section id="product-preview" className="py-20 relative bg-gradient-to-b from-black to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-gradient-to-b from-purple-500/5 to-cyan-500/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[70%] bg-gradient-to-t from-cyan-500/5 to-blue-500/5 blur-3xl rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                Coming Soon
              </span>
              <GradientHeading className="text-4xl md:text-5xl lg:text-6xl">The Future of Investing</GradientHeading>
              <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg">
                Get an exclusive preview of our revolutionary portfolio management system and AI trading bot that's
                changing how the world invests.
              </p>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={0.1 * index}>
              <GlassCard className="text-center p-4 h-full">
                <div className="flex justify-center mb-2">
                  <FloatingElement amplitude={5} period={3}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </FloatingElement>
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Interactive Demo - Now Full Width */}
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="h-full flex flex-col rounded-xl overflow-hidden border border-white/5">
              <div className="p-6 pb-4">
                <h3 className="text-2xl font-semibold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Experience Our AI Trading Bot
                </h3>
                <p className="text-gray-300">
                  Our AI-powered trading bot analyzes market patterns and executes trades with precision. Try this
                  interactive demo to see how it identifies opportunities and manages risk in real-time.
                </p>
              </div>

              <div
                className="flex-grow relative overflow-hidden bg-black/50 mx-6 rounded-lg"
                style={{ minHeight: "400px" }}
              >
                {showDemo ? (
                  <TradingBotDemo />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center flex-col p-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-full blur-xl"></div>
                      <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center relative">
                        <Zap className="h-14 w-14 text-white" />
                      </div>
                    </motion.div>
                    <motion.p
                      className="text-gray-300 text-center max-w-xs mt-6 text-lg"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      Launch the interactive demo to see our AI trading bot in action
                    </motion.p>
                  </div>
                )}
              </div>

              <div className="p-6 pt-4">
                <Button
                  onClick={toggleDemo}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg py-6"
                >
                  {showDemo ? "Hide Demo" : "Launch Interactive Demo"}
                </Button>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-300 text-sm">AI Buy Signals</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-gray-300 text-sm">AI Sell Signals</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-gray-300 text-sm">Risk Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-gray-300 text-sm">Market Sentiment</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* Testimonials Section */}
        {/* <div className="mt-20 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white">What Beta Users Are Saying</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4"></div>
            </div>
          </ScrollReveal>

          <div className="relative h-48">
            <AnimatePresence initial={false} mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === activeTestimonial && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <GlassCard className="h-full flex flex-col justify-center items-center text-center p-8">
                        <div className="text-4xl text-cyan-500 mb-4">"</div>
                        <p className="text-gray-300 italic mb-4">{testimonial.quote}</p>
                        <div className="flex items-center">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.author}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <span className="text-white font-medium">{testimonial.author}</span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div> */}

          {/* <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === activeTestimonial ? "bg-cyan-400 w-6" : "bg-gray-600",
                )}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div> */}

        {/* Enhanced CTA Section */}
        <div className="mt-20 text-center">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur-xl"></div>
              <GlassCard className="relative z-10 max-w-3xl mx-auto p-10 rounded-xl border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-4">Be Among the First</h3>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join our exclusive waitlist today and be the first to experience the future of AI-powered investing.
                  Early adopters will receive lifetime premium features and personalized portfolio analysis.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="#contact">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-10 py-6 rounded-full shadow-lg shadow-purple-500/20">
                      Reserve Your Spot
                    </Button>
                  </a>
                </motion.div>
                <p className="text-gray-400 text-sm mt-4">Limited spots available. No credit card required.</p>
              </GlassCard>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
