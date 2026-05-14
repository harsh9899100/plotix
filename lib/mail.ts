import nodemailer from "nodemailer"

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false = STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM  = `PLOTIX Reality <${process.env.SMTP_USER}>`
const APP   = "PLOTIX Reality"
const URL   = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// ── Verification Email ────────────────────────────────────────────────────────
export async function sendVerificationEmail(email: string, token: string, name: string) {
  const link = `${URL}/verify-email?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Verify your PLOTIX Reality account",
    html: emailTemplate(`
      <h2 style="font-family:Georgia,serif;color:#1a2b4a;">Welcome to PLOTIX Reality, ${name}!</h2>
      <p style="color:#555;font-family:sans-serif;">Please verify your email address to activate your account.</p>
      <a href="${link}" style="display:inline-block;margin:20px 0;padding:14px 32px;background:#1a2b4a;color:#fff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-weight:600;">Verify Email</a>
      <p style="color:#999;font-size:12px;font-family:sans-serif;">Link expires in 1 hour. If you didn't create an account, ignore this email.</p>
    `),
  })
}

// ── Password Reset Email ──────────────────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const link = `${URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Reset your PLOTIX Reality password",
    html: emailTemplate(`
      <h2 style="font-family:Georgia,serif;color:#1a2b4a;">Password Reset Request</h2>
      <p style="color:#555;font-family:sans-serif;">Hi ${name}, we received a request to reset your password.</p>
      <a href="${link}" style="display:inline-block;margin:20px 0;padding:14px 32px;background:#1a2b4a;color:#fff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-weight:600;">Reset Password</a>
      <p style="color:#999;font-size:12px;font-family:sans-serif;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `),
  })
}

// ── Inquiry Notification ──────────────────────────────────────────────────────
export async function sendInquiryNotification(
  agentEmail: string, agentName: string,
  buyerName: string, propertyTitle: string, message: string
) {
  await transporter.sendMail({
    from: FROM,
    to: agentEmail,
    subject: `New inquiry on "${propertyTitle}"`,
    html: emailTemplate(`
      <h2 style="font-family:Georgia,serif;color:#1a2b4a;">New Inquiry Received</h2>
      <p style="color:#555;font-family:sans-serif;">Hi ${agentName}, you have a new inquiry on <strong>${propertyTitle}</strong>.</p>
      <div style="background:#f5f5f0;padding:16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0;color:#333;font-family:sans-serif;"><strong>From:</strong> ${buyerName}</p>
        <p style="margin:8px 0 0;color:#555;font-family:sans-serif;">${message}</p>
      </div>
      <a href="${URL}/dashboard/agent/inquiries" style="display:inline-block;margin:16px 0;padding:12px 28px;background:#1a2b4a;color:#fff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-weight:600;">View Inquiry</a>
    `),
  })
}

// ── Viewing Confirmation ──────────────────────────────────────────────────────
export async function sendViewingConfirmation(
  email: string, name: string,
  propertyTitle: string, scheduledAt: Date, type: string
) {
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" }).format(scheduledAt)
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Viewing confirmed: ${propertyTitle}`,
    html: emailTemplate(`
      <h2 style="font-family:Georgia,serif;color:#1a2b4a;">Viewing Confirmed ✓</h2>
      <p style="color:#555;font-family:sans-serif;">Hi ${name}, your property viewing has been confirmed.</p>
      <div style="background:#f5f5f0;padding:16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0;color:#333;font-family:sans-serif;"><strong>Property:</strong> ${propertyTitle}</p>
        <p style="margin:8px 0 0;color:#555;font-family:sans-serif;"><strong>Date & Time:</strong> ${date}</p>
        <p style="margin:8px 0 0;color:#555;font-family:sans-serif;"><strong>Type:</strong> ${type}</p>
      </div>
      <a href="${URL}/dashboard/buyer/viewings" style="display:inline-block;margin:16px 0;padding:12px 28px;background:#1a2b4a;color:#fff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-weight:600;">View Details</a>
    `),
  })
}

// ── Helper ────────────────────────────────────────────────────────────────────
function emailTemplate(content: string) {
  return `
    <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f9f9f7;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr><td style="background:#1a2b4a;padding:24px 32px;">
            <span style="font-family:Georgia,serif;font-size:24px;color:#fff;font-weight:400;letter-spacing:1px;">PLOTIX Reality</span>
          </td></tr>
          <tr><td style="padding:32px;">${content}</td></tr>
          <tr><td style="background:#f5f5f0;padding:20px 32px;border-top:1px solid #e8e3dc;">
            <p style="margin:0;font-size:12px;color:#999;font-family:sans-serif;">© ${new Date().getFullYear()} PLOTIX Reality. All rights reserved.<br>Vesu, Surat, Gujarat 395007, India</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    </body></html>
  `
}