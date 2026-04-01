import { BrandMark } from '@/components/brand-mark'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-neutral-950 text-neutral-100 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden overflow-hidden border-r border-neutral-800 bg-neutral-950 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_24%)]" />
        <div className="relative z-10">
          <BrandMark />
          <div className="mt-16 max-w-md">
            <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Private workspace</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Inventory, orders, and billing in one controlled workspace.
            </h1>
            <p className="mt-4 text-sm leading-6 text-neutral-400">
              Built for mid-sized businesses that need a minimal interface, role-aware access, and a clean operational model.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid gap-3 text-sm text-neutral-400">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            Organization onboarding, permissions, and tenant-aware navigation.
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            Core master data, inventory visibility, and document workflows.
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <BrandMark />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
