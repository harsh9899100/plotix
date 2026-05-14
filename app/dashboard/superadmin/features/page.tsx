"use client"
import { useState, useTransition } from "react"
import { Flag, Plus, Save, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Button, StatCard } from "@/components/ui"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_SA = { id:"sa1", firstName:"Super", lastName:"Admin", role:"SUPERADMIN", email:"ceo@plotix.in" }

const INIT_FLAGS = [
  { id:"f1", key:"virtual_tours",       name:"Virtual Tours",         desc:"Enable 3D / 360° virtual tour embedding on property pages",       enabled:true,  rolloutPct:100, category:"Features",  stable:true  },
  { id:"f2", key:"ai_recommendations",  name:"AI Property Suggestions",desc:"ML-powered property recommendations on buyer dashboard",          enabled:true,  rolloutPct:80,  category:"AI/ML",     stable:true  },
  { id:"f3", key:"escrow_payments",     name:"Escrow Payments",        desc:"Secure escrow service for high-value property transactions",       enabled:false, rolloutPct:0,   category:"Finance",   stable:false },
  { id:"f4", key:"chat_support",        name:"Live Chat Support",      desc:"Intercom-style live chat widget on all pages",                    enabled:true,  rolloutPct:100, category:"Support",   stable:true  },
  { id:"f5", key:"blockchain_title",    name:"Blockchain Title Deeds", desc:"Property ownership recorded on Polygon blockchain (Beta)",         enabled:false, rolloutPct:0,   category:"Blockchain",stable:false },
  { id:"f6", key:"emi_calculator",      name:"EMI Calculator",         desc:"Embedded EMI calculator on property detail pages",                enabled:true,  rolloutPct:100, category:"Features",  stable:true  },
  { id:"f7", key:"drone_footage",       name:"Drone Footage Upload",   desc:"Allow agents to upload aerial/drone video tours",                  enabled:true,  rolloutPct:50,  category:"Media",     stable:false },
  { id:"f8", key:"neighbourhood_score", name:"Neighbourhood Score",    desc:"AI-generated locality score (schools, transport, amenities)",     enabled:false, rolloutPct:10,  category:"AI/ML",     stable:false },
  { id:"f9", key:"bulk_upload_csv",     name:"CSV Bulk Upload",        desc:"Agents/builders can bulk-import properties via CSV",              enabled:true,  rolloutPct:100, category:"Workflow",  stable:true  },
  { id:"f10",key:"referral_program",    name:"Referral Program",       desc:"Buyers earn rewards for referring friends who complete purchases", enabled:false, rolloutPct:0,   category:"Growth",    stable:false },
]

const CATEGORIES = ["All","Features","AI/ML","Finance","Media","Blockchain","Support","Workflow","Growth"]

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(INIT_FLAGS)
  const [catFilter, setCat] = useState("All")
  const [isPending, start] = useTransition()

  const toggle = (id: string) => setFlags(f => f.map(x => x.id===id ? {...x, enabled:!x.enabled, rolloutPct:!x.enabled?100:0} : x))
  const setRollout = (id: string, pct: number) => setFlags(f => f.map(x => x.id===id ? {...x, rolloutPct:pct} : x))

  const filtered = flags.filter(f => catFilter==="All" || f.category===catFilter)
  const stats = { enabled:flags.filter(f=>f.enabled).length, stable:flags.filter(f=>f.stable&&f.enabled).length, beta:flags.filter(f=>!f.stable&&f.enabled).length }

  const save = () => start(async()=>{ await new Promise(r=>setTimeout(r,700)); toast.success("Feature flags saved!") })

  return (
    <DashboardLayout user={MOCK_SA as any}>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><Flag className="w-7 h-7 text-violet-500"/>Feature Flags</h1><p className="page-subtitle">Toggle features and control rollout percentages across the platform.</p></div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Plus className="w-4 h-4"/>New Flag</Button>
            <Button variant="gold" size="sm" onClick={save} loading={isPending}><Save className="w-4 h-4"/>Save Changes</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Total Flags",   value:flags.length,         icon:<Flag className="w-5 h-5 text-violet-500"/>, color:"bg-violet-50" },
            { label:"Active",        value:stats.enabled,         icon:<Flag className="w-5 h-5 text-emerald-500"/>                       },
            { label:"In Beta",       value:stats.beta,            icon:<Flag className="w-5 h-5 text-amber-500"/>,  color:"bg-amber-50" },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={cn("px-3 py-1.5 rounded-xl text-xs font-body font-medium border transition-all",
              catFilter===c?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400")}>
              {c}
            </button>
          ))}
        </div>

        {/* Flags List */}
        <div className="space-y-3">
          {filtered.map(flag=>(
            <div key={flag.id} className={cn("card p-5 transition-all", flag.enabled?"border-stone-200":"border-stone-100 bg-stone-50/50")}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className={cn("font-body font-semibold text-sm", flag.enabled?"text-stone-900":"text-stone-400")}>{flag.name}</h3>
                    <span className="text-[10px] font-body font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{flag.category}</span>
                    {flag.enabled && (
                      <Badge variant={flag.stable?"green":"amber"} className="text-[10px]">
                        {flag.stable?"Stable":"Beta"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-body text-stone-500 mb-3">{flag.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400 bg-stone-50 px-2 py-1 rounded-lg w-fit">
                    <Flag className="w-3 h-3"/>{flag.key}
                  </div>

                  {/* Rollout slider */}
                  {flag.enabled && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-body mb-2">
                        <span className="text-stone-500">Rollout percentage</span>
                        <span className={cn("font-semibold", flag.rolloutPct===100?"text-emerald-600":flag.rolloutPct>0?"text-amber-600":"text-stone-400")}>
                          {flag.rolloutPct}% of users
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={100} step={10} value={flag.rolloutPct}
                          onChange={e=>setRollout(flag.id, Number(e.target.value))}
                          className="flex-1 h-2 appearance-none bg-stone-200 rounded-full cursor-pointer accent-stone-900"/>
                        <div className="flex gap-1">
                          {[0,25,50,75,100].map(v=>(
                            <button key={v} onClick={()=>setRollout(flag.id,v)}
                              className={cn("text-[10px] font-body font-medium px-1.5 py-0.5 rounded transition-all",
                                flag.rolloutPct===v?"bg-stone-900 text-white":"text-stone-400 hover:text-stone-700")}>
                              {v}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <button onClick={()=>toggle(flag.id)}
                    className={cn("w-12 h-6 rounded-full transition-all duration-200 relative",
                      flag.enabled?"bg-stone-900":"bg-stone-200")}>
                    <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
                      flag.enabled?"left-[26px]":"left-0.5")}/>
                  </button>
                  {!flag.stable && flag.enabled && (
                    <div className="flex items-center gap-1 text-[10px] font-body text-amber-600">
                      <AlertTriangle className="w-3 h-3"/>Beta
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
          <h3 className="font-body font-semibold text-stone-900 text-sm mb-2">📌 How Feature Flags Work</h3>
          <div className="space-y-1.5 text-xs font-body text-stone-500">
            <p>• <strong className="text-stone-700">100% rollout</strong> — Feature is active for all users</p>
            <p>• <strong className="text-stone-700">Partial rollout</strong> — Randomly shown to that % of users (A/B testing)</p>
            <p>• <strong className="text-stone-700">0% / disabled</strong> — Feature is completely hidden from all users</p>
            <p>• Changes take effect within 60 seconds (cached in Redis)</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
