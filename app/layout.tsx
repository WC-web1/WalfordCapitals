import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollProvider } from "@/components/scroll-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Walford Capitals - AI-Powered Investment",
  description: "AI-Powered Portfolio Optimization for Modern Investors",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ScrollProvider>{children}</ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'