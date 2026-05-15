'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, MapPin, Search, Heart, Bell, User, ChevronDown, Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Properties', href: '/properties' },
  { label: 'Buy', href: '/properties?listingFor=sale' },
  { label: 'Rent', href: '/properties?listingFor=rent' },
  { label: 'Agents', href: '/agents' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isHome
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #C9A07A 0%, #A07850 100%)' }}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className={cn(
                    'font-display text-xl font-semibold tracking-tight transition-colors',
                    scrolled || !isHome ? 'text-stone-900' : 'text-white'
                  )}
                >
                  PLOTIX
                </span>
                <span className={cn(
                  'text-[10px] font-body font-medium uppercase tracking-[0.2em] transition-colors',
                  scrolled || !isHome ? 'text-stone-400' : 'text-white/70'
                )}>
                  Reality
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'bg-stone-100 text-stone-900'
                      : scrolled || !isHome
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/properties"
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200',
                  scrolled || !isHome
                    ? 'text-stone-600 hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}>
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/dashboard/favorites"
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200',
                  scrolled || !isHome
                    ? 'text-stone-600 hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}>
                <Heart className="w-5 h-5" />
              </Link>

              <div className="w-px h-6 bg-stone-200 mx-1" />

              <Link href="/login" className={cn(
                'px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-200',
                scrolled || !isHome
                  ? 'text-stone-700 hover:bg-stone-100'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}>
                Log in
              </Link>
              <Link href="/register" className="btn-gold text-sm px-5 py-2.5 rounded-xl">
                List Property
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2.5 rounded-xl transition-colors',
                scrolled || !isHome ? 'text-stone-900' : 'text-white'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        'fixed inset-0 z-40 lg:hidden transition-all duration-300',
        mobileOpen ? 'visible' : 'invisible'
      )}>
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div className={cn(
          'absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
            <span className="font-display text-xl font-semibold">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-stone-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-4 pt-2 border-t border-stone-100 space-y-3 mt-2">
            <Link href="/login" className="btn-secondary w-full justify-center">
              Log in
            </Link>
            <Link href="/register" className="btn-gold w-full justify-center">
              List Property
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
