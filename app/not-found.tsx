import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
export default function NotFound() {
  return (<>
    <Navbar/>
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <div className="font-display text-[120px] lg:text-[160px] font-light text-stone-100 leading-none select-none mb-4">404</div>
        <h1 className="font-display text-3xl font-light text-stone-900 mb-3">Page Not Found</h1>
        <p className="font-body text-stone-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/properties" className="btn-secondary">Browse Properties</Link>
        </div>
      </div>
    </div>
  </>)
}
