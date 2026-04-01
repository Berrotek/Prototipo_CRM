import { ReactNode } from 'react'

export function MasterDataPage({
  title,
  description,
  stats,
  table,
  form,
  help,
}: {
  title: string
  description: string
  stats: { label: string; value: string | number }[]
  table: ReactNode
  form: ReactNode
  help: ReactNode
}) {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Master data</div>
        <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">{description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="text-sm text-neutral-400">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          {table}
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            {form}
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-sm leading-6 text-neutral-400">
            {help}
          </div>
        </div>
      </section>
    </div>
  )
}
