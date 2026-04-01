// src/app/(app)/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Organization-level overview, inventory health, and operational activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Open orders', value: '—' },
          { label: 'Low stock SKUs', value: '—' },
          { label: 'Receipts pending', value: '—' },
          { label: 'Outstanding balance', value: '—' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="text-sm text-neutral-400">{card.label}</div>
            <div className="mt-2 text-3xl font-semibold text-white">{card.value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}