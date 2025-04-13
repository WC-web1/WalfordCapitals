import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Services from "@/components/services"
import Portfolio from "@/components/portfolio"
import ProductPreview from "@/components/product-preview"
import Team from "@/components/team"
import Faq from "@/components/faq"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import CursorEffect from "@/components/cursor-effect"
import AnimatedBackground from "@/components/animated-background"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white overflow-hidden">
      <CursorEffect />
      <AnimatedBackground />
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <ProductPreview />
      <Team />
      <Faq />
      <Contact />
      <Footer />
    </main>
  )
}
