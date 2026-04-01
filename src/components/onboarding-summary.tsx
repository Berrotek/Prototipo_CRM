import { CheckCircle2, Shield, Users, Warehouse } from 'lucide-react'

const items = [
  {
    icon: Warehouse,
    title: 'Organization record',
    description: 'Creates the tenant row with your billing, locale, and operational defaults.',
  },
  {
    icon: Shield,
    title: 'Owner role',
    description: 'Creates the system owner role with full access, ready for later role expansion.',
  },
  {
    icon: Users,
    title: 'Active membership',
    description: 'Links the signed-in user to the new organization immediately.',
  },
  {
    icon: CheckCircle2,
    title: 'Future invite flow',
    description: 'Leaves room for organization invites from settings using your invite tables.',
  },
]

export function OnboardingSummary() {
  return (
    <aside className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      <p className="text-sm font-medium text-neutral-400">Workspace bootstrap</p>
      <h2 className="mt-2 text-xl font-semibold text-white">What this step creates</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-400">
        The first login should establish the tenant cleanly, not rely on hidden side effects.
      </p>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="mt-0.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-200">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-neutral-400">{item.description}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm leading-6 text-neutral-400">
        Defaults in your schema already favor a professional SMB setup: MXN currency, America/Monterrey,
        Spanish locale, no negative stock, and analytics enabled.
      </div>
    </aside>
  )
}
