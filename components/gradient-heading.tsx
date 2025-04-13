import type React from "react"
import { cn } from "@/lib/utils"

interface GradientHeadingProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4"
}

export default function GradientHeading({ children, className, as = "h2" }: GradientHeadingProps) {
  const baseClasses =
    "font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"

  const sizeClasses = {
    h1: "text-4xl md:text-6xl",
    h2: "text-3xl md:text-5xl",
    h3: "text-2xl md:text-4xl",
    h4: "text-xl md:text-3xl",
  }

  const Component = as

  return <Component className={cn(baseClasses, sizeClasses[as], className)}>{children}</Component>
}
