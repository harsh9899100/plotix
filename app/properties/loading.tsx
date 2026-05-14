export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="border-b border-stone-100 px-4 py-5 max-w-screen-2xl mx-auto">
        <div className="h-7 w-64 bg-stone-200 rounded-lg animate-pulse mb-2"/>
        <div className="h-4 w-40 bg-stone-100 rounded-lg animate-pulse"/>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-[280px_1fr_1fr] gap-6">
          <div className="hidden lg:block"><div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">{Array.from({length:8}).map((_,i)=><div key={i} className="h-8 bg-stone-100 rounded-xl animate-pulse" style={{animationDelay:`${i*60}ms`}}/>)}</div></div>
          <div className="hidden lg:block"><div className="w-full h-[calc(100vh-200px)] bg-stone-100 rounded-2xl animate-pulse"/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="bg-white border border-stone-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-stone-200"/>
                <div className="p-4 space-y-3"><div className="h-5 bg-stone-200 rounded w-3/4"/><div className="h-4 bg-stone-100 rounded w-1/2"/><div className="h-4 bg-stone-100 rounded w-full"/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
