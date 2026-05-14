"use client"
import { useState, useTransition } from "react"
import Link from "next/link"
import { Building2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { forgotPasswordAction } from "@/lib/actions/auth"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [isPending, start] = useTransition()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    start(async () => {
      const res = await forgotPasswordAction({ email })
      if (res?.error) toast.error(res.error)
      else { setSent(true); toast.success("Reset email sent!") }
    })
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-stone-100 p-10">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold"><Building2 className="w-5 h-5 text-white"/></div>
          <div><div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div><div className="text-[10px] text-stone-400 uppercase tracking-[.2em] font-body">Reality</div></div>
        </Link>
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-emerald-500"/></div>
            <h2 className="font-display text-2xl font-light text-stone-900 mb-2">Check Your Email</h2>
            <p className="font-body text-stone-500 mb-8">We've sent a password reset link to <strong className="text-stone-700">{email}</strong>. Check your inbox (and spam folder).</p>
            <Link href="/login" className="btn-secondary w-full justify-center">Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-light text-stone-900 mb-2">Forgot Password?</h1>
            <p className="font-body text-stone-400 mb-8 text-sm">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/>
                  <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="input pl-10" autoComplete="email"/>
                </div>
              </div>
              <button type="submit" disabled={isPending} className="btn-gold w-full justify-center py-3.5 rounded-xl text-sm">
                {isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending…</> : "Send Reset Link"}
              </button>
            </form>
            <Link href="/login" className="mt-5 flex items-center gap-2 text-sm font-body text-stone-500 hover:text-stone-800 transition-colors justify-center">
              <ArrowLeft className="w-4 h-4"/>Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
