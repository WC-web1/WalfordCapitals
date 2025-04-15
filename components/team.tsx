"use client"

import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { Linkedin, Mail, Phone } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import ThreeDCard from "@/components/3d-card"
import ParallaxElement from "@/components/parallax-element"
import VectorGraphic from "@/components/vector-graphic"
import Image from "next/image"

export default function Team() {
  const team = [
    {
      name: "Ifham Banday",
      role: "Co-Founder and CEO",
      bio: "Hi, I’m Ifham — an entrepreneur building AI-powered financial solutions to revolutionize investing and create real-world impact.",
      email: "ifhambanday@gmail.com",
      phone: "",
      linkedin: "https://www.linkedin.com/in/ifham-banday-924a26180",
      image: "/images/team/ifham.png",
    },
    {
      name: "Rahul D. Ray",
      role: "Co-Founder and CTO",
      bio: "Architecting next-generation AI and algorithmic trading platforms to redefine quantitative finance.",
      phone: "6371575952",
      linkedin: "#",
      image: "/images/team/rahul.png",
    },
    {
      name: "Rehan Nazir",
      role: "Co-Founder and CFO",
      bio: "Responsible for overseeing a company's financial health and strategy.",
      email: "24f2009335@ds.study.iitm.ac.in",
      phone: "9419729705",
      linkedin: "https://www.linkedin.com/in/rehannazirdar",
      image: "/images/team/rehan.png",
    },
    {
      name: "Hani",
      role: "Co-Founder and CMO",
     
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

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <ParallaxElement key={index} offset={20 + index * 10} direction="up">
              <ScrollReveal direction="up" delay={0.2 * index}>
                <ThreeDCard>
                  <GlassCard className="flex flex-col h-full overflow-hidden p-0">
                    {" "}
                    {/* Removed padding */}
                    <div className="flex flex-col h-full">
                      {/* Image Section - Top Half */}
                      <div className="relative h-[250px] w-full">
                        {/* Profile Image */}
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />

                        {/* Gradient Overlay - blends image into content */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-grow p-6 bg-gradient-to-t from-slate-900 to-slate-900/95">
                        <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                        <p className="text-cyan-400 mb-3">{member.role}</p>

                        <p className="text-gray-300 mb-4">{member.bio}</p>

                        <div className="space-y-2 mt-4">
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
                      </div>
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