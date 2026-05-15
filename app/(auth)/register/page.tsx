import Link from 'next/link'
import Image from 'next/image'
import { Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create Account | PLOTIX Reality' }

const ROLES = [
  { value: 'buyer', label: 'Buyer', desc: 'Looking to buy or rent', emoji: '🏠' },
  { value: 'seller', label: 'Owner/Seller', desc: 'I have property to sell/rent', emoji: '🏡' },
  { value: 'agent', label: 'Agent/Broker', desc: 'Licensed real estate professional', emoji: '👔' },
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-10 group">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C9A07A 0%, #A07850 100%)' }}>
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div>
          <div className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-body">Reality</div>
        </div>
      </Link>

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-light text-stone-900 mb-2">Create Account</h1>
          <p className="font-body text-stone-400">Join thousands of happy homeowners</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {ROLES.map((role) => (
            <label key={role.value}
              className="relative cursor-pointer group">
              <input type="radio" name="role" value={role.value} className="sr-only peer" defaultChecked={role.value === 'buyer'} />
              <div className="p-3 border-2 border-stone-200 rounded-xl text-center transition-all peer-checked:border-stone-900 peer-checked:bg-stone-50 hover:border-stone-400">
                <div className="text-2xl mb-1">{role.emoji}</div>
                <div className="text-xs font-body font-semibold text-stone-700">{role.label}</div>
                <div className="text-[10px] font-body text-stone-400 mt-0.5">{role.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">First Name</label>
              <input type="text" placeholder="Rahul" className="input" autoComplete="given-name" />
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">Last Name</label>
              <input type="text" placeholder="Mehta" className="input" autoComplete="family-name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" placeholder="you@example.com" className="input" autoComplete="email" />
          </div>

          <div>
            <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-body text-stone-500">+91</span>
              <input type="tel" placeholder="98765 43210" className="input pl-12" autoComplete="tel" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">Password</label>
            <input type="password" placeholder="8+ characters" className="input" autoComplete="new-password" />
          </div>

          <div>
            <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">Confirm Password</label>
            <input type="password" placeholder="Repeat password" className="input" autoComplete="new-password" />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-stone-300 mt-0.5 flex-shrink-0" />
            <label htmlFor="terms" className="text-sm font-body text-stone-500 cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-stone-900 underline hover:text-amber-700">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-stone-900 underline hover:text-amber-700">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="btn-gold w-full justify-center py-3.5 rounded-xl text-sm mt-2">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm font-body text-stone-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-stone-900 hover:text-amber-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
