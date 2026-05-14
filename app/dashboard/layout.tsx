// app/dashboard/layout.tsx
// SessionProvider is already provided by the root layout (app/layout.tsx).
// This layout just marks the boundary for dashboard-specific routes.
export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
