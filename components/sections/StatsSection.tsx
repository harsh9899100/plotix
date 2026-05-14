const STATS = [
  {value:"12,400+",label:"Properties Listed",sub:"Across India"},
  {value:"₹2,800 Cr+",label:"Transactions Closed",sub:"In the last year"},
  {value:"28,000+",label:"Happy Customers",sub:"Verified reviews"},
  {value:"4.9/5",label:"Average Rating",sub:"From 8,000+ reviews"},
]
export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-navy">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(s=>(
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-light text-white mb-1">{s.value}</div>
              <div className="font-body font-semibold text-white/70 text-sm mb-0.5">{s.label}</div>
              <div className="font-body text-white/30 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
