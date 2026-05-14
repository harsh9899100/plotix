"use client"
import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from "lucide-react"
import { RegisterSchema, type RegisterInput } from "@/lib/validations/auth"
import { registerAction } from "@/lib/actions/auth"
import { Button, cn } from "@/components/ui"
import toast from "react-hot-toast"

const ROLES = [
  { value: "BUYER",   label: "Buyer",        desc: "Looking to buy or rent",               emoji: "🏠", color: "border-blue-200 hover:border-blue-400",   active: "border-blue-500 bg-blue-50" },
  { value: "OWNER",   label: "Owner/Seller", desc: "Selling my own property",              emoji: "🏡", color: "border-emerald-200 hover:border-emerald-400", active: "border-emerald-500 bg-emerald-50" },
  { value: "AGENT",   label: "Agent/Broker", desc: "Licensed real estate professional",    emoji: "👔", color: "border-violet-200 hover:border-violet-400", active: "border-violet-500 bg-violet-50" },
  { value: "BUILDER", label: "Builder",      desc: "Real estate developer",                emoji: "🏗️", color: "border-amber-200 hover:border-amber-400",   active: "border-amber-500 bg-amber-50" },
]

export default function RegisterPage() {
  const [showPwd, setShowPwd]   = useState(false)
  const [success, setSuccess]   = useState("")
  const [isPending, startTrans] = useTransition()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { role: "BUYER", terms: false },
  })

  const selectedRole = watch("role")

  const onSubmit = (data: RegisterInput) => {
    startTrans(async () => {
      const result = await registerAction(data)
      if (result?.error)   toast.error(result.error)
      if (result?.success) setSuccess(result.success)
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="font-display text-3xl font-light text-stone-900 mb-2">Check your email!</h1>
          <p className="font-body text-stone-500 mb-6">{success}</p>
          <Link href="/login" className="btn-primary px-8 py-3 rounded-xl">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div>
          <div className="text-[10px] text-stone-400 uppercase tracking-[.2em] font-body">Reality</div>
        </div>
      </Link>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-card border border-stone-100 p-8">
        <h1 className="font-display text-3xl font-light text-stone-900 mb-1 text-center">Create Account</h1>
        <p className="font-body text-stone-400 text-center mb-8 text-sm">Join 28,000+ users on PLOTIX Reality</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="label">I am a…</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
              {ROLES.map((r) => (
                <label key={r.value}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRole === r.value ? r.active : r.color + " border-stone-200 bg-white"
                  }`}>
                  <input type="radio" {...register("role")} value={r.value} className="sr-only" />
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs font-body font-semibold text-stone-700 text-center">{r.label}</span>
                  <span className="text-[9px] font-body text-stone-400 text-center leading-tight">{r.desc}</span>
                  {selectedRole === r.value && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.role && <p className="error-msg">{errors.role.message}</p>}
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input {...register("firstName")} placeholder="Rahul" autoComplete="given-name"
                  className={`input pl-10 ${errors.firstName ? "border-rose-400" : ""}`} />
              </div>
              {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last Name</label>
              <input {...register("lastName")} placeholder="Mehta" autoComplete="family-name"
                className={`input ${errors.lastName ? "border-rose-400" : ""}`} />
              {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input {...register("email")} type="email" placeholder="you@example.com" autoComplete="email"
                className={`input pl-10 ${errors.email ? "border-rose-400" : ""}`} />
            </div>
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="label">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-body text-stone-500 pointer-events-none">+91</span>
              <input {...register("phone")} type="tel" placeholder="98765 43210" autoComplete="tel"
                className={`input pl-12 ${errors.phone ? "border-rose-400" : ""}`} />
            </div>
            {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input {...register("password")} type={showPwd ? "text" : "password"} placeholder="8+ characters" autoComplete="new-password"
                className={`input pl-10 pr-10 ${errors.password ? "border-rose-400" : ""}`} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">Confirm Password</label>
            <input {...register("confirmPassword")} type="password" placeholder="Repeat password" autoComplete="new-password"
              className={`input ${errors.confirmPassword ? "border-rose-400" : ""}`} />
            {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" {...register("terms")}
                className="w-4 h-4 rounded border-stone-300 accent-stone-900 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-body text-stone-500">
                I agree to the{" "}
                <Link href="/terms" className="text-stone-800 underline hover:text-amber-700">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-stone-800 underline hover:text-amber-700">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="error-msg">{errors.terms.message}</p>}
          </div>

          <Button type="submit" variant="gold" className="w-full justify-center py-3.5 rounded-xl text-sm" loading={isPending}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm font-body text-stone-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-stone-900 hover:text-amber-700 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
