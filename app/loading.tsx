export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"/>
        <p className="font-body text-stone-400 text-sm">Loading…</p>
      </div>
    </div>
  )
}
