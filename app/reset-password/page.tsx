"use client"
import { useState, useTransition, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Eye, EyeOff, CheckCircle } from "lucide-react"
import { resetPasswordAction } from "@/lib/actions/auth"
import toast from "react-hot-toast"

function ResetContent() {
  const params = useSearchParams()
  const token  = params.get("token") || ""
  const router = useRouter()
  const [pwd, setPwd] = useState(""); const [confirm, setConfirm] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [done, setDone] = useState(false)
  const [isPending, start] = useTransition()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd !== confirm) { toast.error("Passwords do not match"); return }
    start(async () => {
      const res = await resetPasswordAction({ password:pwd, confirmPassword:confirm }, token)
      if (res?.error) toast.error(res.error)
      else { setDone(true); setTimeout(()=>router.push("/login"), 2000) }
    })
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-stone-100 p-10">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold"><Building2 className="w-5 h-5 text-white"/></div>
          <div><div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div><div className="text-[10px] text-stone-400 uppercase tracking-[.2em] font-body">Reality</div></div>
        </Link>
        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-emerald-500"/></div>
            <h2 className="font-display text-2xl font-light text-stone-900 mb-2">Password Reset!</h2>
            <p className="font-body text-stone-500">Redirecting you to login…</p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-light text-stone-900 mb-2">Reset Password</h1>
            <p className="font-body text-stone-400 mb-8 text-sm">Enter your new password below.</p>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input type={showPwd?"text":"password"} required value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="8+ characters" className="input pr-10" autoComplete="new-password"/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">{showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat password" className="input" autoComplete="new-password"/>
              </div>
              {pwd && (
                <div className="flex gap-1.5">
                  {[pwd.length>=8,/[A-Z]/.test(pwd),/[0-9]/.test(pwd),/[^a-zA-Z0-9]/.test(pwd)].map((ok,i)=>(
                    <div key={i} className={`h-1 flex-1 rounded-full ${ok?"bg-emerald-400":"bg-stone-200"}`}/>
                  ))}
                </div>
              )}
              <button type="submit" disabled={isPending||!token} className="btn-gold w-full justify-center py-3.5 rounded-xl text-sm">
                {isPending?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Resetting…</>:"Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin"/></div>}><ResetContent/></Suspense>
}
