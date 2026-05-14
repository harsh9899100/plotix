"use client"
import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { LoginSchema, type LoginInput } from "@/lib/validations/auth"
import { loginAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [isPending, startTrans] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: LoginInput) => {
    startTrans(async () => {
      const result = await loginAction(data)
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left — Form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white order-2 lg:order-1">
        <Link href="/" className="flex items-center gap-2.5 mb-12 w-fit">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-[.2em] font-body">Reality</div>
          </div>
        </Link>

        <div className="max-w-sm w-full">
          <h1 className="font-display text-4xl font-light text-stone-900 mb-2">Welcome back</h1>
          <p className="font-body text-stone-400 mb-8">Sign in to your PLOTIX account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input id="email" type="email" placeholder="you@example.com"
                  {...register("email")}
                  className={`input pl-10 ${errors.email ? "border-rose-400" : ""}`}
                  autoComplete="email" />
              </div>
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-xs font-body text-amber-700 hover:text-amber-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••"
                  {...register("password")}
                  className={`input pl-10 pr-10 ${errors.password ? "border-rose-400" : ""}`}
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center py-3.5 rounded-xl text-sm mt-2" loading={isPending}>
              {isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100" /></div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs font-body text-stone-400">or continue with</span>
            </div>
          </div>

          {/* Google */}
          <button className="btn-secondary w-full justify-center py-3 rounded-xl text-sm gap-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Demo accounts */}
          {/* <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <p className="text-xs font-body font-semibold text-stone-500 uppercase tracking-wider mb-3">Demo Accounts</p>
            <div className="space-y-1.5">
              {[
                { label: "Buyer",      email: "arjun@demo.com",  pwd: "Demo@1234" },
                { label: "Agent",      email: "priya@demo.com",  pwd: "Demo@1234" },
                { label: "Admin",      email: "admin@plotix.in", pwd: "Admin@1234" },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between text-xs font-body">
                  <span className="text-stone-500 w-14">{d.label}:</span>
                  <span className="text-stone-700 flex-1">{d.email}</span>
                  <span className="text-stone-400 ml-2">{d.pwd}</span>
                </div>
              ))}
            </div>
          </div> */}

          <p className="text-center text-sm font-body text-stone-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-stone-900 hover:text-amber-700 transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>

      {/* Right — Image */}
      <div className="hidden lg:block relative order-1 lg:order-2">
        <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&h=1200&fit=crop" alt="Login"
          fill className="object-cover" priority sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-900/40 to-stone-950/80" />
        <div className="absolute inset-0 flex items-end p-12">
          <div>
            <blockquote className="font-display text-3xl font-light text-white leading-snug mb-4">
              "Found our dream home in just 2 weeks through PLOTIX."
            </blockquote>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-body text-white font-semibold text-sm">Vikram Desai</p>
                <p className="font-body text-white/50 text-xs">Software Engineer, Surat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
