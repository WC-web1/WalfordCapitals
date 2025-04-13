"use client"

import type React from "react"

import { useState } from "react"
import GlassCard from "@/components/glass-card"
import GradientHeading from "@/components/gradient-heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { sendContactEmail, bookAppointment } from "@/lib/actions"
import { motion, AnimatePresence } from "framer-motion"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAppointmentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitted(true)
        setFormData({ name: "", email: "", phone: "", message: "" })

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError(result.message || "Failed to send message. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error("Contact form error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBookAppointment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsBooking(true)
    setBookingError(null)

    try {
      // Validate form data
      if (!appointmentData.name || !appointmentData.email) {
        setBookingError("Please provide your name and email to book an appointment")
        setIsBooking(false)
        return
      }

      const result = await bookAppointment(appointmentData)

      if (result.success) {
        setBooked(true)
        setAppointmentData({ name: "", email: "", phone: "", date: "", time: "" })

        // Reset success message after 5 seconds
        setTimeout(() => setBooked(false), 5000)
      } else {
        setBookingError(result.message || "Failed to book appointment. Please try again.")
      }
    } catch (err) {
      setBookingError("An unexpected error occurred. Please try again later.")
      console.error("Booking error:", err)
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <section id="contact" className="py-20 relative bg-gradient-to-b from-slate-950 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <GradientHeading>Contact Us</GradientHeading>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Get in touch with our team to learn more about our AI-powered investment solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <GlassCard>
            <h3 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h3>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                    <p className="text-green-400 font-medium">Message Sent Successfully!</p>
                  </div>
                  <p className="text-green-300">Thank you for your message! We'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                >
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <p className="text-red-400">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white min-h-[120px]"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </GlassCard>

          <GlassCard>
            <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-cyan-400 mr-4 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Email</h4>
                  <a href="mailto:rayrahuldw@gmail.com" className="text-gray-400 hover:text-cyan-400">
                    rayrahuldw@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-cyan-400 mr-4 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Phone</h4>
                  <a href="tel:6371575952" className="text-gray-400 hover:text-cyan-400">
                    +91 6371575952
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-cyan-400 mr-4 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Office</h4>
                  <p className="text-gray-400">
                    Walford Capitals Headquarters
                    <br />
                    Financial District, Mumbai
                    <br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <h4 className="text-lg font-medium text-white mb-3">Schedule a Consultation</h4>
              <p className="text-gray-400 mb-4">
                Book a free consultation with our investment experts to discuss your financial goals.
              </p>

              <AnimatePresence mode="wait">
                {booked ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                      <p className="text-green-400 font-medium">Appointment Requested!</p>
                    </div>
                    <p className="text-green-300">We'll contact you shortly to confirm your consultation.</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {bookingError && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                          <p className="text-red-400">{bookingError}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 mb-4">
                      <Input
                        name="name"
                        value={appointmentData.name}
                        onChange={handleAppointmentChange}
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        placeholder="Your name"
                        required
                      />
                      <Input
                        name="email"
                        type="email"
                        value={appointmentData.email}
                        onChange={handleAppointmentChange}
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        placeholder="Your email"
                        required
                      />
                      <Input
                        name="phone"
                        type="tel"
                        value={appointmentData.phone}
                        onChange={handleAppointmentChange}
                        className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        placeholder="Your phone (optional)"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          name="date"
                          type="date"
                          value={appointmentData.date}
                          onChange={handleAppointmentChange}
                          className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        />
                        <Input
                          name="time"
                          type="time"
                          value={appointmentData.time}
                          onChange={handleAppointmentChange}
                          className="bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-white"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      onClick={handleBookAppointment}
                      disabled={isBooking}
                    >
                      {isBooking ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Book Appointment <Calendar className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
