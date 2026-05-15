import Link from 'next/link'
import Image from 'next/image'
import { Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Login | PLOTIX Reality' }

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left — Form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
        <Link href="/" className="flex items-center gap-2.5 mb-14 group w-fit">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C9A07A 0%, #A07850 100%)' }}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold text-stone-900">PLOTIX</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-body">Reality</div>
          </div>
        </Link>

        <div className="max-w-sm w-full">
          <h1 className="font-display text-4xl font-light text-stone-900 mb-2">Welcome back</h1>
          <p className="font-body text-stone-400 mb-8">Sign in to your PLOTIX account</p>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input type="email" placeholder="you@example.com" className="input" autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-body font-semibold text-stone-600 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-body text-amber-700 hover:text-amber-600">
                  Forgot password?
                </Link>
              </div>
              <input type="password" placeholder="••••••••" className="input" autoComplete="current-password" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-stone-300" />
              <label htmlFor="remember" className="text-sm font-body text-stone-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3.5 rounded-xl text-sm mt-2">
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs font-body text-stone-400">or continue with</span>
            </div>
          </div>

          <button className="btn-secondary w-full justify-center py-3 rounded-xl text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm font-body text-stone-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-stone-900 hover:text-amber-700 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Image */}
      <div className="hidden lg:block relative">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&h=1200&fit=crop"
          alt="Login background"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,43,74,0.85) 0%, rgba(26,43,74,0.4) 100%)' }} />
        <div className="absolute inset-0 flex items-end p-12">
          <div>
            <blockquote className="font-display text-3xl font-light text-white leading-snug mb-4">
              "Found my dream home in Vesu through PLOTIX in just 2 weeks."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 relative">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                  alt="Testimonial"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-body text-white font-semibold text-sm">Vikram Desai</div>
                <div className="font-body text-white/50 text-xs">Software Engineer, Surat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
