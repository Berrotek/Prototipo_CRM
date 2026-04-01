export function InventorySummary() {
  const cards = [
    { label: 'Tracked SKUs', value: '—', note: 'Products with track_inventory enabled' },
    { label: 'Low stock alerts', value: '—', note: 'Below reorder point' },
    { label: 'Out of stock', value: '—', note: 'No available stock' },
    { label: 'Reserved units', value: '—', note: 'Open reservations across locations' },
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
