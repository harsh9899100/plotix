import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PLOTIX Reality — Premium Properties Across India',
    template: '%s | PLOTIX Reality',
  },
  description:
    'Discover your perfect property on PLOTIX Reality. Browse thousands of premium residential and commercial listings across India with real-time map search and advanced filters.',
  keywords: ['real estate', 'property', 'buy property', 'rent property', 'surat real estate', 'homes for sale', 'plotix'],
  authors: [{ name: 'PLOTIX Reality' }],
  creator: 'PLOTIX Reality',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://plotix.in',
    siteName: 'PLOTIX Reality',
    title: 'PLOTIX Reality — Premium Properties Across India',
    description: 'Discover your perfect property with real-time map search and advanced filters.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'PLOTIX Reality',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PLOTIX Reality',
    description: 'Discover premium properties across India.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-stone-900 antialiased">
        {children}
      </body>
    </html>
  )
}
