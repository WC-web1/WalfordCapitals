"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ScrollContextType {
  scrollY: number
}

const ScrollContext = createContext<ScrollContextType>({ scrollY: 0 })

export const useScroll = () => useContext(ScrollContext)

interface ScrollProviderProps {
  children: ReactNode
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <ScrollContext.Provider value={{ scrollY }}>{children}</ScrollContext.Provider>
}
