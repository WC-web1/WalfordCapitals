import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn("relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 rounded-xl opacity-50"></div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
