'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Building2,
  ChevronRight,
  ClipboardList,
  FileText,
  House,
  Layers3,
  Lock,
  Package,
  Settings,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react'
import { canAccess, type Membership, type OrgPermission } from '@/lib/auth/permissions'

type NavItem = {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  permission?: OrgPermission
  comingSoon?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: House },
      { label: 'Organizations', href: '/organizations', icon: Building2 },
      { label: 'Settings', href: '/settings', icon: Settings, permission: 'manage_org' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Locations', icon: Layers3, comingSoon: true },
      { label: 'Customers', icon: Users, comingSoon: true },
      { label: 'Suppliers', icon: Truck, comingSoon: true },
      { label: 'Products', icon: Package, comingSoon: true },
    ],
  },
  {
    title: 'Execution',
    items: [
      { label: 'Inventory', icon: BarChart3, comingSoon: true },
      { label: 'Sales Orders', icon: FileText, comingSoon: true },
      { label: 'Purchase Orders', icon: ClipboardList, comingSoon: true },
      { label: 'Shipments', icon: Truck, comingSoon: true },
      { label: 'Invoices', icon: FileText, comingSoon: true },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Members', icon: Users, permission: 'manage_members', comingSoon: true },
      { label: 'Roles', icon: ShieldCheck, permission: 'manage_roles', comingSoon: true },
      { label: 'Tasks', icon: ClipboardList, permission: 'manage_tasks', comingSoon: true },
      { label: 'Integrations', icon: Lock, permission: 'manage_integrations', comingSoon: true },
    ],
  },
]

export function AppFrame({
  children,
  user,
  memberships,
}: {
  children: React.ReactNode
  user: { email?: string | null; user_metadata?: Record<string, unknown> }
  memberships: Membership[]
}) {
  const pathname = usePathname()
  const currentMembership = memberships[0] ?? null
  const currentOrg = currentMembership?.organizations ?? null
  const permissions = currentMembership?.roles?.permissions ?? {}

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-neutral-800 bg-neutral-950 px-4 py-6 lg:block">
          <div className="mb-8 space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Workspace</div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
              <div className="text-xs text-neutral-500">Organization</div>
              <div className="mt-1 text-sm font-medium text-white">{currentOrg?.name ?? 'No organization'}</div>
              <div className="mt-1 text-xs text-neutral-500">{currentMembership?.roles?.name ?? 'No role'}</div>
            </div>
          </div>

          <nav className="space-y-5">
            {sections.map((section) => (
              <div key={section.title}>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = item.href ? pathname === item.href : false
                    const allowed = canAccess(permissions, item.permission)
                    const Icon = item.icon

                    if (item.href && allowed && !item.comingSoon) {
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                            active
                              ? 'bg-neutral-800 text-white'
                              : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </span>
                        </Link>
                      )
                    }

                    return (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                          allowed ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs uppercase tracking-wide">
                          {!allowed ? (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              Locked
                            </>
                          ) : item.comingSoon ? (
                            <>
                              <ChevronRight className="h-3.5 w-3.5" />
                              Soon
                            </>
                          ) : null}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 lg:px-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Signed in</div>
              <div className="text-sm font-medium text-neutral-200">{user.email ?? 'Unknown user'}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300">
                {currentOrg?.name ?? 'Select organization'}
              </div>
            </div>
          </header>

          <main className="flex-1 bg-neutral-900 px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
