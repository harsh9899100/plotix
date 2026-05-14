"use client"
import { useState } from "react"
import { FolderOpen, Upload, Download, Eye, Trash2, Plus, Search, FileText, Image, File } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Tabs, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const DOCUMENTS = [
  { id:"d1", name:"RERA Registration Certificate.pdf", type:"RERA", size:"2.4 MB", project:"All Projects", uploadedAt:new Date(Date.now()-90*86400000), status:"VERIFIED" },
  { id:"d2", name:"GST Registration Certificate.pdf", type:"LEGAL", size:"1.1 MB", project:"All Projects", uploadedAt:new Date(Date.now()-90*86400000), status:"VERIFIED" },
  { id:"d3", name:"Sky Residences — Approved Plans.pdf", type:"BLUEPRINT", size:"18.7 MB", project:"Sky Residences", uploadedAt:new Date(Date.now()-30*86400000), status:"VERIFIED" },
  { id:"d4", name:"Sky Residences — Completion Certificate.pdf", type:"COMPLETION", size:"3.2 MB", project:"Sky Residences", uploadedAt:new Date(Date.now()-15*86400000), status:"PENDING" },
  { id:"d5", name:"Harmony Villas — RERA Approval.pdf", type:"RERA", size:"5.6 MB", project:"Harmony Villas", uploadedAt:new Date(Date.now()-60*86400000), status:"VERIFIED" },
  { id:"d6", name:"Harmony Villas — Site Photos (Nov 2024).zip", type:"MEDIA", size:"124 MB", project:"Harmony Villas", uploadedAt:new Date(Date.now()-7*86400000), status:"N/A" },
]

const TYPE_ICONS: Record<string, any> = { RERA:FileText, LEGAL:FileText, BLUEPRINT:File, COMPLETION:FileText, MEDIA:Image }
const TYPE_CFG: Record<string, any> = { RERA:"blue", LEGAL:"violet", BLUEPRINT:"amber", COMPLETION:"emerald", MEDIA:"stone" }
const STATUS_CFG: Record<string, any> = { VERIFIED:"green", PENDING:"amber", "N/A":"stone" }

export default function BuilderDocumentsPage() {
  const [documents, setDocuments] = useState(DOCUMENTS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = documents.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.project.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || d.type === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><FolderOpen className="w-7 h-7 text-amber-500" />Documents</h1>
            <p className="page-subtitle">Manage RERA certificates, project approvals, and legal documents.</p>
          </div>
          <button onClick={() => toast.success("Upload document dialog")} className="btn-gold">
            <Upload className="w-4 h-4" />Upload Document
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Documents" value={documents.length} icon={<FolderOpen className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Verified" value={documents.filter(d => d.status === "VERIFIED").length} icon={<FileText className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Pending Review" value={documents.filter(d => d.status === "PENDING").length} icon={<FileText className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Projects Covered" value={new Set(documents.map(d => d.project)).size} icon={<File className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search documents..." className="flex-1 max-w-sm" />
          <Tabs
            tabs={[{ value:"all", label:"All" }, { value:"RERA", label:"RERA" }, { value:"LEGAL", label:"Legal" }, { value:"BLUEPRINT", label:"Blueprints" }, { value:"MEDIA", label:"Media" }]}
            active={tab} onChange={setTab}
          />
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Document</th><th>Type</th><th>Project</th><th>Size</th><th>Status</th><th>Uploaded</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(doc => {
                const Icon = TYPE_ICONS[doc.type] || FileText
                return (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-stone-500" />
                        </div>
                        <p className="font-medium text-stone-900 text-sm max-w-[180px] truncate">{doc.name}</p>
                      </div>
                    </td>
                    <td><Badge variant={TYPE_CFG[doc.type]}>{doc.type}</Badge></td>
                    <td className="text-sm text-stone-600">{doc.project}</td>
                    <td className="text-sm text-stone-400">{doc.size}</td>
                    <td><Badge variant={STATUS_CFG[doc.status]}>{doc.status}</Badge></td>
                    <td className="text-xs text-stone-400">{formatDate(doc.uploadedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => toast.success(`Opening ${doc.name}`)} className="btn-icon text-stone-400 hover:text-stone-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => toast.success(`Downloading ${doc.name}`)} className="btn-icon text-stone-400 hover:text-blue-600">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleting(doc.id)} className="btn-icon text-stone-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { setDocuments(p => p.filter(d => d.id !== deleting)); setDeleting(null); toast.success("Document deleted") }}
        title="Delete Document?"
        description="This will permanently remove this document from the platform."
        confirmLabel="Delete"
        danger
      />
    </DashboardLayout>
  )
}
