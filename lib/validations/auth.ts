// lib/validations/auth.ts
import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const RegisterSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName:  z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email:     z.string().email({ message: "Invalid email address" }),
  phone:     z.string().regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number" }),
  password:  z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character" }),
  confirmPassword: z.string(),
  role:      z.enum(["BUYER", "AGENT", "BUILDER", "OWNER"]),
  terms:     z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// Property
export const PropertySchema = z.object({
  title:       z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  type:        z.enum(["RESIDENTIAL","COMMERCIAL","INDUSTRIAL","AGRICULTURAL","MIXED"]),
  listingFor:  z.enum(["SALE","RENT"]),
  price:       z.number().positive("Price must be positive"),
  area:        z.number().positive("Area must be positive"),
  bedrooms:    z.number().int().min(0),
  bathrooms:   z.number().int().min(0),
  kitchens:    z.number().int().min(0),
  parking:     z.number().int().min(0),
  city:        z.string().min(2),
  state:       z.string().min(2),
  locality:    z.string().optional(),
  address:     z.string().min(10),
  furnishing:  z.enum(["FURNISHED","SEMI_FURNISHED","UNFURNISHED"]).optional(),
  amenities:   z.array(z.string()).default([]),
})

// Inquiry
export const InquirySchema = z.object({
  name:       z.string().min(2, "Name is required"),
  email:      z.string().email("Invalid email"),
  phone:      z.string().optional(),
  message:    z.string().min(10, "Message must be at least 10 characters"),
  propertyId: z.string(),
})

// Property Request
export const PropertyRequestSchema = z.object({
  title:       z.string().min(5, "Title is required"),
  description: z.string().optional(),
  propertyType: z.enum(["RESIDENTIAL","COMMERCIAL","INDUSTRIAL","AGRICULTURAL","MIXED"]).optional(),
  minPrice:    z.number().optional(),
  maxPrice:    z.number().optional(),
  minArea:     z.number().optional(),
  maxArea:     z.number().optional(),
  bedrooms:    z.number().int().optional(),
  bathrooms:   z.number().int().optional(),
  cities:      z.array(z.string()).default([]),
  amenities:   z.array(z.string()).default([]),
})

// Viewing
export const ViewingSchema = z.object({
  propertyId:  z.string(),
  scheduledAt: z.string().min(1, "Date & time required"),
  type:        z.enum(["IN_PERSON","VIRTUAL","VIDEO_CALL"]),
  notes:       z.string().optional(),
})

// Review
export const ReviewSchema = z.object({
  propertyId: z.string(),
  rating:     z.number().int().min(1).max(5),
  comment:    z.string().min(20, "Review must be at least 20 characters"),
  agentRating: z.number().int().min(1).max(5).optional(),
})

// Contact Form
export const ContactSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  email:   z.string().email("Invalid email"),
  phone:   z.string().optional(),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

// Profile
export const ProfileSchema = z.object({
  firstName:    z.string().min(2),
  lastName:     z.string().min(2),
  phone:        z.string().optional(),
  bio:          z.string().optional(),
  profileImage: z.string().optional(),
})

// Testimonial
export const TestimonialSchema = z.object({
  rating:      z.number().int().min(1).max(5),
  message:     z.string().min(30, "Testimonial must be at least 30 characters"),
  displayName: z.string().optional(),
  role:        z.string().optional(),
})

export type LoginInput            = z.infer<typeof LoginSchema>
export type RegisterInput         = z.infer<typeof RegisterSchema>
export type ChangePasswordInput   = z.infer<typeof ChangePasswordSchema>
export type PropertyInput         = z.infer<typeof PropertySchema>
export type InquiryInput          = z.infer<typeof InquirySchema>
export type PropertyRequestInput  = z.infer<typeof PropertyRequestSchema>
export type ViewingInput          = z.infer<typeof ViewingSchema>
export type ReviewInput           = z.infer<typeof ReviewSchema>
export type ContactInput          = z.infer<typeof ContactSchema>
export type ProfileInput          = z.infer<typeof ProfileSchema>
