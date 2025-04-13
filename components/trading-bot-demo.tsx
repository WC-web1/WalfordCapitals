"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, BarChart2, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Demo trading bot component
export default function TradingBotDemo() {
  const [timeframe, setTimeframe] = useState("1h")
  const [riskLevel, setRiskLevel] = useState(50)
  const [isRunning, setIsRunning] = useState(true)
  const [signals, setSignals] = useState<{ type: "buy" | "sell" | "alert"; x: number; y: number }[]>([])
  const [currentPrice, setCurrentPrice] = useState(100)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [profitLoss, setProfitLoss] = useState(0)
  const [trades, setTrades] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; text: string } | null>(null)
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Initialize price history
  useEffect(() => {
    // Generate initial price data
    const initialPrices = generatePriceData(100, 100)
    setPriceHistory(initialPrices)
    setCurrentPrice(initialPrices[initialPrices.length - 1])
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    let lastTimestamp = 0
    const fps = 10 // Updates per second

    const animate = (timestamp: number) => {
      if (timestamp - lastTimestamp > 1000 / fps) {
        // Update price data
        setPriceHistory((prev) => {
          if (prev.length > 100) {
            prev = prev.slice(-100)
          }
          const lastPrice = prev[prev.length - 1]
          const newPrice = generateNextPrice(lastPrice)
          setCurrentPrice(newPrice)

          // Randomly generate trading signals
          if (Math.random() < 0.05) {
            const signalType = Math.random() > 0.5 ? "buy" : "sell"
            const x = prev.length
            const y = newPrice

            setSignals((prevSignals) => [
              ...prevSignals.slice(-10), // Keep only last 10 signals
              { type: signalType, x, y },
            ])

            // Show notification
            setNotification({
              type: signalType,
              message: signalType === "buy" ? "AI detected buying opportunity" : "AI detected selling opportunity",
            })

            // Clear notification after 3 seconds
            setTimeout(() => setNotification(null), 3000)

            // Update trading stats
            setTrades((prev) => prev + 1)
            const isSuccessful = Math.random() < 0.7 // 70% success rate for demo
            setProfitLoss((prev) => {
              const change = isSuccessful
                ? (signalType === "buy" ? 1 : -1) * (Math.random() * 2 + 1)
                : (signalType === "buy" ? -1 : 1) * (Math.random() * 1 + 0.5)
              return prev + change
            })
            setSuccessRate((prev) => {
              const newSuccessRate = (prev * trades + (isSuccessful ? 100 : 0)) / (trades + 1)
              return Number.parseFloat(newSuccessRate.toFixed(1))
            })
          }

          // Occasionally add alert signals
          if (Math.random() < 0.02) {
            setSignals((prevSignals) => [...prevSignals.slice(-10), { type: "alert", x: prev.length, y: newPrice }])

            // Show alert notification
            setNotification({
              type: "alert",
              message: "Risk alert: Volatility increasing",
            })

            // Clear notification after 3 seconds
            setTimeout(() => setNotification(null), 3000)
          }

          return [...prev, newPrice]
        })

        lastTimestamp = timestamp
      }

      drawChart()
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, priceHistory.length])

  // Draw chart
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i < 5; i++) {
      const y = i * (height / 4)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i < 10; i++) {
      const x = i * (width / 9)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    if (priceHistory.length < 2) return

    // Calculate min and max for scaling
    const min = Math.min(...priceHistory) * 0.95
    const max = Math.max(...priceHistory) * 1.05
    const range = max - min

    // Draw price line
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.8)")
    gradient.addColorStop(1, "rgba(124, 58, 237, 0.8)")

    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.beginPath()

    priceHistory.forEach((price, i) => {
      const x = (i / (priceHistory.length - 1)) * width
      const y = height - ((price - min) / range) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Add glow effect
    ctx.shadowColor = "rgba(6, 182, 212, 0.5)"
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw area under the curve
    ctx.beginPath()
    priceHistory.forEach((price, i) => {
      const x = (i / (priceHistory.length - 1)) * width
      const y = height - ((price - min) / range) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    const areaGradient = ctx.createLinearGradient(0, 0, 0, height)
    areaGradient.addColorStop(0, "rgba(6, 182, 212, 0.2)")
    areaGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.1)")
    areaGradient.addColorStop(1, "rgba(6, 182, 212, 0)")
    ctx.fillStyle = areaGradient
    ctx.fill()

    // Draw signals with animated glow
    signals.forEach((signal) => {
      const x = (signal.x / (priceHistory.length - 1)) * width
      const y = height - ((signal.y - min) / range) * height

      // Draw signal glow
      const glowRadius = 8
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)

      if (signal.type === "buy") {
        glowGradient.addColorStop(0, "rgba(34, 197, 94, 0.8)") // green
        glowGradient.addColorStop(1, "rgba(34, 197, 94, 0)")
      } else if (signal.type === "sell") {
        glowGradient.addColorStop(0, "rgba(239, 68, 68, 0.8)") // red
        glowGradient.addColorStop(1, "rgba(239, 68, 68, 0)")
      } else {
        glowGradient.addColorStop(0, "rgba(234, 179, 8, 0.8)") // yellow
        glowGradient.addColorStop(1, "rgba(234, 179, 8, 0)")
      }

      ctx.beginPath()
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
      ctx.fillStyle = glowGradient
      ctx.fill()

      // Draw signal circle
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)

      if (signal.type === "buy") {
        ctx.fillStyle = "rgba(34, 197, 94, 0.9)" // green
      } else if (signal.type === "sell") {
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)" // red
      } else {
        ctx.fillStyle = "rgba(234, 179, 8, 0.9)" // yellow
      }

      ctx.fill()

      // Add signal icon
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "10px sans-serif"

      if (signal.type === "buy") {
        ctx.fillText("↑", x, y)
      } else if (signal.type === "sell") {
        ctx.fillText("↓", x, y)
      } else {
        ctx.fillText("!", x, y)
      }
    })

    // Draw current price
    const lastPrice = priceHistory[priceHistory.length - 1]
    const lastY = height - ((lastPrice - min) / range) * height

    // Draw price marker
    ctx.beginPath()
    ctx.arc(width, lastY, 6, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(width, lastY, 4, 0, Math.PI * 2)
    ctx.fillStyle = profitLoss >= 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)"
    ctx.fill()

    // Draw price label
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "white"
    ctx.textAlign = "right"
    ctx.fillText(`$${lastPrice.toFixed(2)}`, width - 12, lastY - 12)

    // Draw time labels
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.textAlign = "center"

    // Draw time markers
    const timeLabels = ["1m", "5m", "15m", "30m", "1h", "4h"]
    for (let i = 0; i < 6; i++) {
      const x = width * (i / 5)
      ctx.fillText(timeLabels[i], x, height - 5)
    }
  }

  // Generate random price data
  const generatePriceData = (startPrice: number, length: number) => {
    const prices = [startPrice]
    for (let i = 1; i < length; i++) {
      prices.push(generateNextPrice(prices[i - 1]))
    }
    return prices
  }

  // Generate next price with random walk
  const generateNextPrice = (lastPrice: number) => {
    const changePercent = (Math.random() - 0.48) * 1 // Slightly biased upward
    const change = lastPrice * (changePercent / 100)
    return Math.max(lastPrice + change, 1) // Ensure price doesn't go below 1
  }

  // Toggle simulation
  const toggleSimulation = () => {
    setIsRunning(!isRunning)
  }

  // Reset simulation
  const resetSimulation = () => {
    const initialPrices = generatePriceData(100, 100)
    setPriceHistory(initialPrices)
    setCurrentPrice(initialPrices[initialPrices.length - 1])
    setSignals([])
    setProfitLoss(0)
    setTrades(0)
    setSuccessRate(0)
    setIsRunning(true)
  }

  // Handle risk level change
  const handleRiskChange = (value: number[]) => {
    setRiskLevel(value[0])

    // Show notification when risk level changes significantly
    if (Math.abs(riskLevel - value[0]) > 20) {
      setNotification({
        type: value[0] > riskLevel ? "high-risk" : "low-risk",
        message:
          value[0] > riskLevel
            ? "Increased risk level: More aggressive trading"
            : "Decreased risk level: More conservative trading",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Handle canvas mouse move for tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || priceHistory.length === 0) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find closest data point
    const dataIndex = Math.round((x / rect.width) * (priceHistory.length - 1))
    if (dataIndex >= 0 && dataIndex < priceHistory.length) {
      const price = priceHistory[dataIndex]
      const min = Math.min(...priceHistory) * 0.95
      const max = Math.max(...priceHistory) * 1.05
      const range = max - min
      const dataY = rect.height - ((price - min) / range) * rect.height

      // Check if mouse is close to the data point
      if (Math.abs(y - dataY) < 20) {
        setShowTooltip({
          x: (dataIndex / (priceHistory.length - 1)) * rect.width,
          y: dataY,
          text: `$${price.toFixed(2)}`,
        })
        return
      }
    }

    // Check if mouse is close to any signal
    for (const signal of signals) {
      const signalX = (signal.x / (priceHistory.length - 1)) * rect.width
      const min = Math.min(...priceHistory) * 0.95
      const max = Math.max(...priceHistory) * 1.05
      const range = max - min
      const signalY = rect.height - ((signal.y - min) / range) * rect.height

      // Calculate distance from mouse to signal
      const distance = Math.sqrt(Math.pow(x - signalX, 2) + Math.pow(y - signalY, 2))

      if (distance < 15) {
        let tooltipText = ""
        if (signal.type === "buy") {
          tooltipText = "AI Buy Signal: $" + signal.y.toFixed(2)
        } else if (signal.type === "sell") {
          tooltipText = "AI Sell Signal: $" + signal.y.toFixed(2)
        } else {
          tooltipText = "Risk Alert: $" + signal.y.toFixed(2)
        }

        setShowTooltip({
          x: signalX,
          y: signalY,
          text: tooltipText,
        })
        return
      }
    }

    setShowTooltip(null)
  }

  const handleMouseLeave = () => {
    setShowTooltip(null)
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-24 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="1m">1m</SelectItem>
            <SelectItem value="5m">5m</SelectItem>
            <SelectItem value="15m">15m</SelectItem>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="4h">4h</SelectItem>
            <SelectItem value="1d">1d</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-gray-400">Risk:</span>
          <Slider value={[riskLevel]} min={0} max={100} step={1} className="flex-1" onValueChange={handleRiskChange} />
          <span
            className={cn(
              "text-xs w-8 font-medium",
              riskLevel < 30 ? "text-green-400" : riskLevel < 70 ? "text-yellow-400" : "text-red-400",
            )}
          >
            {riskLevel}%
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "border-slate-700 text-gray-300 transition-colors",
            isRunning ? "bg-red-500/10 hover:bg-red-500/20" : "bg-green-500/10 hover:bg-green-500/20",
          )}
          onClick={toggleSimulation}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="border-slate-700 text-gray-300 bg-slate-800/50 hover:bg-slate-700/50"
          onClick={resetSimulation}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Chart */}
      <div className="flex-grow relative border border-slate-800 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute pointer-events-none bg-slate-900/90 text-white text-xs py-1 px-2 rounded shadow-lg z-20 transform -translate-x-1/2 -translate-y-8 border border-slate-700"
            style={{ left: showTooltip.x, top: showTooltip.y }}
          >
            {showTooltip.text}
          </div>
        )}

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium z-20 shadow-lg",
                notification.type === "buy"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : notification.type === "sell"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : notification.type === "alert"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : notification.type === "high-risk"
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30",
              )}
            >
              <div className="flex items-center">
                {notification.type === "buy" && <TrendingUp className="h-4 w-4 mr-2" />}
                {notification.type === "sell" && <TrendingDown className="h-4 w-4 mr-2" />}
                {notification.type === "alert" && <AlertTriangle className="h-4 w-4 mr-2" />}
                {notification.type === "high-risk" && <Zap className="h-4 w-4 mr-2" />}
                {notification.type === "low-risk" && <Shield className="h-4 w-4 mr-2" />}
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400 mb-1">Current Price</div>
          <div className="text-white font-semibold flex items-center">
            <BarChart2 className="h-3 w-3 mr-1 text-cyan-400" />${currentPrice.toFixed(2)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400 mb-1">P&L</div>
          <div className={cn("font-semibold flex items-center", profitLoss >= 0 ? "text-green-500" : "text-red-500")}>
            {profitLoss >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {profitLoss >= 0 ? "+" : ""}
            {profitLoss.toFixed(2)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400 mb-1">Trades</div>
          <div className="text-white font-semibold flex items-center">
            <Zap className="h-3 w-3 mr-1 text-purple-400" />
            {trades}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400 mb-1">Success Rate</div>
          <div
            className={cn(
              "font-semibold flex items-center",
              successRate >= 70 ? "text-green-500" : successRate >= 50 ? "text-yellow-500" : "text-red-500",
            )}
          >
            <Star className="h-3 w-3 mr-1" />
            {successRate}%
          </div>
        </div>
      </div>

      {/* Enhanced AI Analysis */}
      <div className="mt-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-lg p-3 text-xs border border-slate-700/30">
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 mr-2"></div>
          <span className="text-gradient bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">
            AI Analysis
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start">
            <TrendingUp className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
            <span className="text-gray-300">
              {profitLoss >= 0
                ? "Bullish momentum detected. AI recommends increasing position sizes."
                : "Market showing signs of recovery. Consider accumulating at support levels."}
            </span>
          </div>

          <div className="flex items-start">
            <TrendingDown className="h-3 w-3 text-red-500 mt-0.5 mr-1 flex-shrink-0" />
            <span className="text-gray-300">
              {profitLoss >= 0
                ? "Potential resistance at $" + (currentPrice * 1.05).toFixed(2) + ". Consider taking partial profits."
                : "Bearish trend continuing. Reduce exposure and wait for confirmation of reversal."}
            </span>
          </div>

          <div className="flex items-start">
            <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
            <span className="text-gray-300">Volatility increasing. Adjusting stop-loss levels to protect capital.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components
function Play(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function Pause(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

function Star(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Shield(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
