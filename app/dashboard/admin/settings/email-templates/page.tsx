"use client"
import { useState } from "react"
import { Mail, Plus, Edit, Trash2, Eye, Copy, Send } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, ConfirmDialog } from "@/components/ui"
import toast from "react-hot-toast"


const TEMPLATES = [
  { id:"t1", name:"Welcome Email", trigger:"On User Registration", category:"TRANSACTIONAL", subject:"Welcome to PLOTIX Reality 🏠", lastModified:"2024-11-01", status:"ACTIVE" },
  { id:"t2", name:"New Inquiry Notification", trigger:"When inquiry submitted", category:"NOTIFICATION", subject:"New Property Inquiry — {{property_name}}", lastModified:"2024-10-28", status:"ACTIVE" },
  { id:"t3", name:"Viewing Reminder", trigger:"24 hours before viewing", category:"REMINDER", subject:"Upcoming Property Viewing Tomorrow — {{property_name}}", lastModified:"2024-10-25", status:"ACTIVE" },
  { id:"t4", name:"Commission Credit", trigger:"When commission paid", category:"TRANSACTIONAL", subject:"Commission Credited — ₹{{amount}}", lastModified:"2024-10-20", status:"ACTIVE" },
  { id:"t5", name:"Property Approved", trigger:"Admin approves listing", category:"NOTIFICATION", subject:"Your listing is Live! 🎉 — {{property_name}}", lastModified:"2024-10-15", status:"ACTIVE" },
  { id:"t6", name:"Property Rejected", trigger:"Admin rejects listing", category:"NOTIFICATION", subject:"Action Required: Listing needs updates", lastModified:"2024-10-15", status:"ACTIVE" },
  { id:"t7", name:"KYC Verified", trigger:"Agent KYC approved", category:"NOTIFICATION", subject:"Your KYC has been verified ✅", lastModified:"2024-10-10", status:"ACTIVE" },
  { id:"t8", name:"Monthly Newsletter", trigger:"Manual / Scheduled", category:"MARKETING", subject:"PLOTIX Monthly — {{month}} Market Insights", lastModified:"2024-11-05", status:"DRAFT" },
]

const CAT_CFG: Record<string, any> = { TRANSACTIONAL:"blue", NOTIFICATION:"violet", REMINDER:"amber", MARKETING:"emerald" }

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(TEMPLATES)
  const [deleting, setDeleting] = useState<string | null>(null)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Mail className="w-7 h-7 text-blue-500" />Email Templates</h1>
            <p className="page-subtitle">Manage all platform transactional and marketing email templates.</p>
          </div>
          <button onClick={() => toast.success("Template editor opening...")} className="btn-gold">
            <Plus className="w-4 h-4" />New Template
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Templates", value:templates.length, color:"bg-stone-100" },
            { label:"Active", value:templates.filter(t => t.status === "ACTIVE").length, color:"bg-emerald-50" },
            { label:"Draft", value:templates.filter(t => t.status === "DRAFT").length, color:"bg-amber-50" },
            { label:"Categories", value:new Set(templates.map(t => t.category)).size, color:"bg-blue-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Template list */}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Category</th>
                <th>Subject Line</th>
                <th>Trigger</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id}>
                  <td>
                    <p className="font-medium text-stone-900">{t.name}</p>
                  </td>
                  <td>
                    <Badge variant={CAT_CFG[t.category]}>{t.category}</Badge>
                  </td>
                  <td>
                    <p className="text-sm text-stone-500 max-w-[220px] truncate font-mono text-xs">{t.subject}</p>
                  </td>
                  <td>
                    <p className="text-xs text-stone-400">{t.trigger}</p>
                  </td>
                  <td>
                    <Badge variant={t.status === "ACTIVE" ? "green" : "stone"}>{t.status}</Badge>
                  </td>
                  <td className="text-xs text-stone-400">{t.lastModified}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => toast.success(`Previewing "${t.name}"`)} className="btn-icon text-stone-400 hover:text-stone-700" title="Preview">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => toast.success(`Editing "${t.name}"`)} className="btn-icon text-stone-400 hover:text-blue-600" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { const dup = { ...t, id:`t${Date.now()}`, name:`${t.name} (Copy)`, status:"DRAFT" }; setTemplates(p => [...p, dup]); toast.success("Template duplicated") }}
                        className="btn-icon text-stone-400 hover:text-violet-600" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => toast.success(`Sending test email for "${t.name}"`)} className="btn-icon text-stone-400 hover:text-emerald-600" title="Send test">
                        <Send className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleting(t.id)} className="btn-icon text-stone-400 hover:text-rose-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { setTemplates(p => p.filter(t => t.id !== deleting)); setDeleting(null); toast.success("Template deleted") }}
        title="Delete Template?"
        description="This will permanently remove this email template. Any automated emails using this template will stop working."
        confirmLabel="Delete"
        danger
      />
    </DashboardLayout>
  )
}
