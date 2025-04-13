"use server"

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

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // In a real application, you would use a service like Nodemailer, SendGrid, etc.
    // For this demo, we'll simulate sending an email

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      return { success: false, message: "Please fill in all required fields" }
    }

    // Format the email content
    const subject = `New Contact Form Submission from ${formData.name}`
    const body = `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone || "Not provided"}
      
      Message:
      ${formData.message}
    `

    // In a real application, you would send the email here
    console.log("Sending email to CTO (rayrahuldw@gmail.com):")
    console.log("Subject:", subject)
    console.log("Body:", body)

    // For demonstration purposes, we'll just simulate a successful email send
    // In a real application, you would check the response from your email service

    // Simulate a slight delay to make it feel more realistic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success
    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    console.error("Error sending contact email:", error)
    return { success: false, message: "Failed to send message. Please try again later." }
  }
}

export async function bookAppointment(formData: AppointmentFormData) {
  try {
    // Validate form data
    if (!formData.name || !formData.email) {
      return { success: false, message: "Please fill in all required fields" }
    }

    // Format the email content
    const subject = `New Appointment Request from ${formData.name}`
    const body = `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone || "Not provided"}
      Preferred Date: ${formData.date || "Not specified"}
      Preferred Time: ${formData.time || "Not specified"}
      
      This user has requested to book a consultation appointment.
    `

    // In a real application, you would send the email here
    console.log("Sending appointment request to CTO (rayrahuldw@gmail.com):")
    console.log("Subject:", subject)
    console.log("Body:", body)

    // Simulate a slight delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success
    return { success: true, message: "Appointment request sent successfully!" }
  } catch (error) {
    console.error("Error booking appointment:", error)
    return { success: false, message: "Failed to book appointment. Please try again later." }
  }
}
