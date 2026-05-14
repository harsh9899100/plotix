"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Video, Plus } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { cn } from "@/lib/utils"

const VIEWINGS = [
  { id:"v1", propertyTitle:"Modern 3BHK in Adajan", buyerName:"Rajesh Kumar", date:new Date(), time:"10:00", duration:60, type:"IN_PERSON", status:"SCHEDULED" },
  { id:"v2", propertyTitle:"Penthouse in Vesu", buyerName:"Arjun Mehta", date:new Date(), time:"14:00", duration:45, type:"VIRTUAL", status:"SCHEDULED" },
  { id:"v3", propertyTitle:"Villa in SG Highway", buyerName:"Preethi Nair", date:new Date(Date.now()+86400000), time:"11:30", duration:90, type:"IN_PERSON", status:"SCHEDULED" },
]
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function ViewingCalendarPage() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [selected, setSelected] = useState<Date|null>(today)
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }
  const dayViewings = (d: Date) => VIEWINGS.filter(v => v.date.toDateString() === d.toDateString())
  const selectedViewings = selected ? dayViewings(selected) : []

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/agent/viewings" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
            <div>
              <h1 className="page-title flex items-center gap-2"><Calendar className="w-7 h-7 text-emerald-500"/>Viewing Calendar</h1>
              <p className="page-subtitle">{VIEWINGS.length} upcoming viewings</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 card-flat p-5">
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth} className="btn-icon"><ChevronLeft className="w-4 h-4"/></button>
              <h2 className="font-display text-lg font-medium text-stone-900">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="btn-icon"><ChevronRight className="w-4 h-4"/></button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => <p key={d} className="text-center text-xs font-body font-semibold text-stone-400 py-1">{d}</p>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({length:firstDay}).map((_,i) => <div key={`e-${i}`}/>)}
              {Array.from({length:daysInMonth}).map((_,i) => {
                const d = new Date(year, month, i+1)
                const has = dayViewings(d).length > 0
                const isToday = d.toDateString() === today.toDateString()
                const isSel = selected?.toDateString() === d.toDateString()
                return (
                  <button key={i} onClick={() => setSelected(d)}
                    className={cn("aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-body relative transition-all",
                      isSel?"bg-stone-900 text-white":isToday?"bg-amber-50 text-amber-700 font-semibold":"hover:bg-stone-50 text-stone-700")}>
                    {i+1}
                    {has && <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSel?"bg-white":"bg-emerald-400"}`}/>}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="lg:col-span-2 card-flat p-5">
            <h3 className="font-display text-lg font-medium text-stone-900 mb-4">
              {selected ? selected.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"}) : "Select a date"}
            </h3>
            {selectedViewings.length === 0 ? (
              <div className="text-center py-12"><Calendar className="w-10 h-10 text-stone-200 mx-auto mb-3"/><p className="text-sm font-body text-stone-400">No viewings today</p></div>
            ) : (
              <div className="space-y-3">
                {selectedViewings.map(v => (
                  <Link key={v.id} href={`/dashboard/agent/viewings/${v.id}`} className="block p-4 rounded-xl border border-stone-200 hover:border-stone-400 transition-all bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body font-semibold text-stone-900">{v.time}</span>
                      <Badge variant={v.type==="VIRTUAL"?"violet":"blue"}>{v.type.replace("_"," ")}</Badge>
                    </div>
                    <p className="text-sm text-stone-700 font-body">{v.propertyTitle}</p>
                    <p className="text-xs text-stone-400 mt-1">{v.duration}min · {v.buyerName}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
