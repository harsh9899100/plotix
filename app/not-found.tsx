// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-9xl font-light text-stone-100 select-none mb-4">404</div>
        <h1 className="font-display text-3xl font-light text-stone-900 mb-2">Page Not Found</h1>
        <p className="font-body text-stone-400 text-base mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/properties" className="btn-secondary">Browse Properties</Link>
        </div>
      </div>
    </div>
  )
}
