"use client"

import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { Linkedin, Mail, Phone } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import ThreeDCard from "@/components/3d-card"
import ParallaxElement from "@/components/parallax-element"
import VectorGraphic from "@/components/vector-graphic"

export default function Team() {
  const team = [
    {
      name: "Rahul D. Ray",
      role: "Co-Founder and CTO",
      bio: "A specialist in algorithmic trading and quantitative analysis, Rahul drives innovation by merging AI-powered solutions with traditional market insights. His leadership has boosted trade execution efficiency by 35% and increased portfolio returns by 20%, positioning Walford Capitals at the forefront of modern investment strategies.",
      email: "rayrahuldw@gmail.com",
      phone: "6371575952",
      linkedin: "#",
    },
    {
      name: "Rehan Nazir",
      role: "Co-Founder and CFO",
      bio: "With expertise in financial modeling and market analysis, Rehan develops innovative investment strategies that combine traditional wisdom with cutting-edge AI insights.",
      email: "24f2009335@ds.study.iitm.ac.in",
      phone: "9419729705",
      linkedin: "https://www.linkedin.com/in/rehannazirdar",
    },
    {
      name: "Ifham Banday",
      role: "CEO",
      bio: "Specializing in machine learning and predictive analytics, Ifham builds the algorithms that power our portfolio optimization and risk management systems.",
      email: "ifhambanday@gmail.com",
      phone: "",
      linkedin: "https://www.linkedin.com/in/ifham-banday-924a26180",
    },
  ]

  return (
    <section id="team" className="py-20 relative bg-gradient-to-b from-black to-slate-950">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <GradientHeading>Our Team</GradientHeading>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Meet the experts behind Walford Capitals' innovative investment strategies
            </p>
          </div>
        </ScrollReveal>

        {/* Vector Graphics with Parallax */}
        <ParallaxElement className="absolute top-40 left-5 z-0" offset={35} direction="left">
          <VectorGraphic type="grid" width={180} height={180} opacity={0.15} />
        </ParallaxElement>

        <ParallaxElement className="absolute bottom-40 right-5 z-0" offset={45} direction="right">
          <VectorGraphic type="wave" width={220} height={120} opacity={0.15} />
        </ParallaxElement>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <ParallaxElement key={index} offset={20 + index * 10} direction="up">
              <ScrollReveal direction="up" delay={0.2 * index}>
                <ThreeDCard>
                  <GlassCard className="flex flex-col h-full">
                    <div className="mb-4 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-600/30 flex items-center justify-center relative z-10">
                        <span className="text-4xl font-bold text-white">{member.name.charAt(0)}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                    <p className="text-cyan-400 mb-3">{member.role}</p>

                    <p className="text-gray-400 mb-4 flex-grow">{member.bio}</p>

                    <div className="space-y-2 mt-auto">
                      {member.email && (
                        <div className="flex items-center group">
                          <Mail className="h-4 w-4 text-cyan-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          <a href={`mailto:${member.email}`} className="text-gray-300 hover:text-cyan-400 text-sm">
                            {member.email}
                          </a>
                        </div>
                      )}

                      {member.phone && (
                        <div className="flex items-center group">
                          <Phone className="h-4 w-4 text-cyan-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          <a href={`tel:${member.phone}`} className="text-gray-300 hover:text-cyan-400 text-sm">
                            {member.phone}
                          </a>
                        </div>
                      )}

                      {member.linkedin && (
                        <div className="flex items-center group">
                          <Linkedin className="h-4 w-4 text-cyan-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-cyan-400 text-sm"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </ThreeDCard>
              </ScrollReveal>
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  )
}
