// app/layout.tsx
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "PLOTIX Reality — Premium Properties Across India", template: "%s | PLOTIX Reality" },
  description: "Discover premium residential and commercial properties across India. Advanced search, map view, and expert agents.",
  keywords: ["real estate","property india","buy property","rent property","plotix"],
  authors: [{ name: "PLOTIX Reality" }],
  openGraph: {
    type: "website", locale: "en_IN", url: "https://plotix.in",
    siteName: "PLOTIX Reality",
    title: "PLOTIX Reality — Premium Properties Across India",
    description: "Discover premium properties with real-time map search and advanced filters.",
    images: [{ url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#ffffff", width: "device-width", initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-stone-900 antialiased">
        {/* SessionProvider at root so useSession() works on ALL pages — navbar, public, dashboard */}
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { fontFamily: "var(--font-dm-sans)", fontSize: "14px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
