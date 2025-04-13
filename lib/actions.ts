"use server"

import nodemailer from "nodemailer"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

interface AppointmentFormData {
  name: string
  email: string
  phone?: string
  date?: string
  time?: string
}

// Set up the transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // your Gmail email
    pass: process.env.EMAIL_PASSWORD, // your Gmail app password (not your real Gmail password)
  },
})

const CTO_EMAIL = "rayrahuldw@gmail.com"

export async function sendContactEmail(formData: ContactFormData) {
  try {
    if (!formData.name || !formData.email || !formData.message) {
      return { success: false, message: "Please fill in all required fields" }
    }

    const subject = `New Contact Form Submission from ${formData.name}`
    const body = `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone || "Not provided"}
      
      Message:
      ${formData.message}
    `

    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USERNAME}>`,
      to: CTO_EMAIL,
      subject,
      text: body,
    }

    await transporter.sendMail(mailOptions)

    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    console.error("Error sending contact email:", error)
    return { success: false, message: "Failed to send message. Please try again later." }
  }
}

export async function bookAppointment(formData: AppointmentFormData) {
  try {
    if (!formData.name || !formData.email) {
      return { success: false, message: "Please fill in all required fields" }
    }

    const subject = `New Appointment Request from ${formData.name}`
    const body = `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone || "Not provided"}
      Preferred Date: ${formData.date || "Not specified"}
      Preferred Time: ${formData.time || "Not specified"}

      This user has requested to book a consultation appointment.
    `

    const mailOptions = {
      from: `"Website Booking" <${process.env.EMAIL_USERNAME}>`,
      to: CTO_EMAIL,
      subject,
      text: body,
    }

    await transporter.sendMail(mailOptions)

    return { success: true, message: "Appointment request sent successfully!" }
  } catch (error) {
    console.error("Error booking appointment:", error)
    return { success: false, message: "Failed to book appointment. Please try again later." }
  }
}
