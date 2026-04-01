import { ClipboardList, Clock3, PackageCheck, Truck } from 'lucide-react'

const stats = [
  { label: 'Open orders', value: '—', icon: ClipboardList },
  { label: 'In fulfillment', value: '—', icon: PackageCheck },
  { label: 'Awaiting shipment', value: '—', icon: Truck },
  { label: 'Overdue', value: '—', icon: Clock3 },
]

export function OrdersSummary() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-neutral-400">{stat.label}</div>
              <Icon className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
          </div>
        )
      })}
    </section>
  )
}
