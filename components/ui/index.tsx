"use client"
// components/ui/index.tsx — all base UI primitives

import { forwardRef, useState, useEffect } from "react"
import { X, ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg" | "icon"
  loading?: boolean
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
    const variants: Record<string, string> = {
      primary:   "bg-stone-900 text-white hover:bg-stone-700 focus-visible:ring-stone-900",
      secondary: "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 focus-visible:ring-stone-400",
      gold:      "text-white focus-visible:ring-amber-400",
      ghost:     "bg-transparent text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-400",
      danger:    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
      success:   "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
    }
    const sizes: Record<string, string> = {
      sm:   "text-xs px-3 py-2",
      md:   "text-sm px-5 py-2.5",
      lg:   "text-base px-7 py-3.5",
      icon: "p-2.5",
    }
    const isGold = variant === "gold"
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        style={isGold ? { background: "linear-gradient(135deg,#C9A07A,#A07850)", boxShadow: "0 2px 12px rgba(201,160,122,.3)" } : undefined}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </button>
    )
  }
)
Button.displayName = "Button"

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <div className="relative">
          {leftIcon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-400 focus:border-rose-400 focus:ring-rose-200",
              className
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400">{rightIcon}</span>}
        </div>
        {error      && <p className="error-msg">{error}</p>}
        {helperText && !error && <p className="text-xs text-stone-400 mt-1.5 font-body">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <textarea ref={ref} id={inputId}
          className={cn("textarea", error && "border-rose-400", className)} {...props} />
        {error && <p className="error-msg">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <div className="relative">
          <select ref={ref} id={inputId}
            className={cn("select pr-10", error && "border-rose-400", className)} {...props}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        </div>
        {error && <p className="error-msg">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"

// ── Checkbox ──────────────────────────────────────────────────────────────────
interface CheckboxProps { id: string; label: React.ReactNode; checked?: boolean; onChange?: (v: boolean) => void; className?: string }
export function Checkbox({ id, label, checked, onChange, className }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("flex items-center gap-2.5 cursor-pointer group", className)}>
      <input type="checkbox" id={id} checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900/20 accent-stone-900" />
      <span className="text-sm font-body text-stone-700 group-hover:text-stone-900 transition-colors">{label}</span>
    </label>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps { children: React.ReactNode; variant?: "blue"|"green"|"amber"|"rose"|"violet"|"stone"|"navy"|"gold"; className?: string }
export function Badge({ children, variant = "stone", className }: BadgeProps) {
  const variants: Record<string, string> = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    rose:   "bg-rose-50 text-rose-700 border-rose-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    stone:  "bg-stone-100 text-stone-600 border-stone-200",
    navy:   "bg-[#1a2b4a] text-white border-[#1a2b4a]",
    gold:   "text-white border-transparent",
  }
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-semibold border",
      variants[variant],
      variant === "gold" && "bg-gradient-gold",
      className
    )}>{children}</span>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
interface AvatarProps { src?: string; name?: string; size?: "sm"|"md"|"lg"|"xl"; className?: string }
export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" }
  const initials = name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"
  return (
    <div className={cn("relative rounded-full overflow-hidden bg-stone-200 flex items-center justify-center flex-shrink-0", sizes[size], className)}>
      {src ? (
        <img src={src} alt={name || "avatar"} className="w-full h-full object-cover" />
      ) : (
        <span className="font-body font-semibold text-stone-600">{initials}</span>
      )}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", className }: { size?: "sm"|"md"|"lg"; className?: string }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }
  return <Loader2 className={cn("animate-spin text-stone-400", sizes[size], className)} />
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean; onClose: () => void
  title?: string; description?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}
export function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", full: "max-w-[95vw]" }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn("relative w-full bg-white rounded-2xl shadow-2xl animate-slide-up", sizes[size])}>
        {(title || description) && (
          <div className="flex items-start justify-between p-6 border-b border-stone-100">
            <div>
              {title && <h3 className="font-display text-xl font-medium text-stone-900">{title}</h3>}
              {description && <p className="text-sm text-stone-500 font-body mt-1">{description}</p>}
            </div>
            <button onClick={onClose} className="btn-icon flex-shrink-0 ml-4"><X className="w-5 h-5" /></button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
interface ConfirmProps {
  open: boolean; onClose: () => void; onConfirm: () => void
  title: string; description?: string; confirmLabel?: string; danger?: boolean; loading?: boolean
}
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", danger = false, loading }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", danger ? "bg-rose-50" : "bg-amber-50")}>
          <span className="text-2xl">{danger ? "🗑️" : "⚠️"}</span>
        </div>
        <h3 className="font-display text-xl font-medium text-stone-900 mb-2">{title}</h3>
        {description && <p className="text-sm text-stone-500 font-body mb-6">{description}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
interface TabsProps {
  tabs: { value: string; label: string; icon?: React.ReactNode; count?: number }[]
  active: string; onChange: (v: string) => void; className?: string
}
export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 bg-stone-100 rounded-xl p-1", className)}>
      {tabs.map((t) => (
        <button key={t.value} onClick={() => onChange(t.value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-body font-medium transition-all",
            active === t.value ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
          )}>
          {t.icon}{t.label}
          {t.count !== undefined && (
            <span className={cn("px-1.5 py-0.5 rounded-full text-xs font-semibold", active === t.value ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-600")}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps { page: number; totalPages: number; onChange: (p: number) => void }
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (i === 0) return 1
    if (i === 6) return totalPages
    const start = Math.max(2, page - 2)
    const end   = Math.min(totalPages - 1, page + 2)
    if (i === 1 && start > 2) return -1
    if (i === 5 && end < totalPages - 1) return -2
    return start + (i - (start > 2 ? 2 : 1))
  })

  return (
    <nav className="flex items-center justify-center gap-1.5">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="btn-icon disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
      {pages.map((p, i) =>
        p < 0 ? (
          <span key={i} className="w-9 flex items-center justify-center text-stone-400 text-sm">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)}
            className={cn("w-9 h-9 rounded-xl text-sm font-body font-medium transition-all",
              page === p ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100")}>
            {p}
          </button>
        )
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        className="btn-icon disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
    </nav>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyProps { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }
export function EmptyState({ icon, title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      {icon && <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-5">{icon}</div>}
      <h3 className="font-display text-2xl font-light text-stone-800 mb-2">{title}</h3>
      {description && <p className="font-body text-stone-400 text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ── Card Skeleton ─────────────────────────────────────────────────────────────
export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="h-5 bg-stone-200 rounded w-3/4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn("h-4 bg-stone-100 rounded", i % 2 === 0 ? "w-full" : "w-2/3")} />
      ))}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string | number
  change?: string; changeType?: "up" | "down" | "neutral"
  icon?: React.ReactNode; color?: string; className?: string
}
export function StatCard({ label, value, change, changeType = "neutral", icon, color = "bg-stone-100", className }: StatCardProps) {
  const changeColors = { up: "text-emerald-600", down: "text-rose-500", neutral: "text-stone-400" }
  return (
    <div className={cn("card-flat p-5 hover:border-stone-200 transition-all", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-body text-stone-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="font-display text-3xl font-light text-stone-900 leading-none">{value}</p>
          {change && (
            <p className={cn("text-xs font-body mt-2 flex items-center gap-1", changeColors[changeType])}>
              {changeType === "up" ? "↑" : changeType === "down" ? "↓" : "→"} {change}
            </p>
          )}
        </div>
        {icon && <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", color)}>{icon}</div>}
      </div>
    </div>
  )
}

// ── Search Input ──────────────────────────────────────────────────────────────
import { Search } from "lucide-react"
export function SearchInput({ value, onChange, placeholder = "Search…", className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
      <input type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input pl-10 pr-4" />
      {value && (
        <button onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export { cn } from "@/lib/utils"
