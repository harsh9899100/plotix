"use client"
import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Building2, CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { verifyEmailAction } from "@/lib/actions/auth"

function VerifyContent() {
  const params   = useSearchParams()
  const token    = params.get("token")
  const [status, setStatus] = useState<"loading"|"success"|"error">("loading")
  const [message, setMessage] = useState("")
  const hasRun = useRef(false)          // ← add this line

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("No verification token found."); return }
    if (hasRun.current) return          // ← add this line
    hasRun.current = true               // ← add this line

    verifyEmailAction(token).then(res => {
      if (res?.success) { setStatus("success"); setMessage(res.success) }
      else { setStatus("error"); setMessage(res?.error || "Verification failed.") }
    }).catch(() => {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    })
  }, [token])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-stone-100 p-10 text-center">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold"><Building2 className="w-5 h-5 text-white"/></div>
          <div><div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div><div className="text-[10px] text-stone-400 uppercase tracking-[.2em] font-body">Reality</div></div>
        </Link>
        {status==="loading" && (<><div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><Loader2 className="w-8 h-8 text-stone-400 animate-spin"/></div><h2 className="font-display text-2xl font-light text-stone-900 mb-2">Verifying your email…</h2><p className="font-body text-stone-400 text-sm">Please wait a moment.</p></>)}
        {status==="success" && (<><div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-emerald-500"/></div><h2 className="font-display text-2xl font-light text-stone-900 mb-2">Email Verified!</h2><p className="font-body text-stone-500 mb-8">{message}</p><Link href="/login" className="btn-gold px-8 py-3.5 rounded-xl">Sign In Now</Link></>)}
        {status==="error" && (<><div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5"><XCircle className="w-8 h-8 text-rose-500"/></div><h2 className="font-display text-2xl font-light text-stone-900 mb-2">Verification Failed</h2><p className="font-body text-stone-500 mb-8">{message}</p><div className="flex gap-3 justify-center"><Link href="/login" className="btn-secondary">Back to Login</Link><Link href="/register" className="btn-gold">Register Again</Link></div></>)}
      </div>
    </div>
  )
}
export default function VerifyEmailPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-stone-400"/></div>}><VerifyContent/></Suspense>
}
