export function SalesOrderSummary() {
  const cards = [
    { label: 'Draft orders', value: '—', note: 'Orders not yet confirmed' },
    { label: 'Open orders', value: '—', note: 'Confirmed but not fully fulfilled' },
    { label: 'Fulfillment progress', value: '—', note: 'Lines fulfilled vs ordered' },
    { label: 'Daily order value', value: '—', note: 'Sales total today' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="text-sm text-neutral-400">{card.label}</div>
          <div className="mt-2 text-3xl font-semibold text-white">{card.value}</div>
          <div className="mt-2 text-xs text-neutral-500">{card.note}</div>
        </div>
      ))}
    </div>
  )
}
