"use client"

import { useState } from "react"
import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ScrollReveal from "@/components/scroll-reveal"
import ParallaxElement from "@/components/parallax-element"
import VectorGraphic from "@/components/vector-graphic"

interface FaqItem {
  question: string
  answer: string
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FaqItem[] = [
    {
      question: "How does AI improve investment strategies?",
      answer:
        "AI analyzes vast amounts of market data to identify patterns and trends that humans might miss. Our algorithms continuously learn and adapt to changing market conditions, enabling more accurate predictions and optimized portfolio allocations that maximize returns while managing risk.",
    },
    {
      question: "What types of assets do you include in portfolios?",
      answer:
        "We create diversified portfolios that include traditional assets like stocks, bonds, gold, and real estate, as well as alternative investments. Our AI-driven approach determines the optimal allocation across these asset classes based on your risk tolerance and financial goals.",
    },
    {
      question: "How accurate are your market predictions?",
      answer:
        "While no prediction system is perfect, our AI models have demonstrated significant accuracy. For example, we predicted NVIDIA's stock downfall with remarkable precision. Our models are continuously refined and improved based on new data and market conditions.",
    },
    {
      question: "What is the minimum investment required?",
      answer:
        "Our investment solutions are designed to be accessible to a range of investors. The minimum investment varies depending on the specific strategy and service level. Please contact us for a personalized consultation to discuss your investment needs.",
    },
    {
      question: "How do you manage risk in volatile markets?",
      answer:
        "Our risk management approach combines AI-powered analytics with traditional hedging strategies. We continuously monitor market conditions and adjust portfolio allocations to mitigate downside risk during volatile periods while maintaining exposure to potential upside.",
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <GradientHeading>Frequently Asked Questions</GradientHeading>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Get answers to common questions about our AI-powered investment approach
            </p>
          </div>
        </ScrollReveal>

        {/* Vector Graphics with Parallax */}
        <ParallaxElement className="absolute top-20 right-5 z-0" offset={30} direction="right">
          <VectorGraphic type="dots" width={150} height={150} opacity={0.15} />
        </ParallaxElement>

        <ParallaxElement className="absolute bottom-20 left-5 z-0" offset={25} direction="left">
          <VectorGraphic type="circuit" width={180} height={180} opacity={0.15} />
        </ParallaxElement>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <ParallaxElement key={index} offset={10 + index * 5} direction={index % 2 === 0 ? "left" : "right"}>
              <ScrollReveal delay={0.1 * index}>
                <GlassCard
                  className={cn("mb-4 transition-all duration-300", openIndex === index ? "border-cyan-500/50" : "")}
                >
                  <button className="w-full flex justify-between items-center py-2" onClick={() => toggleFaq(index)}>
                    <h3 className="text-left text-lg font-medium text-white">{faq.question}</h3>
                    <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-1">
                          <p className="text-gray-400">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </ScrollReveal>
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  )
}
