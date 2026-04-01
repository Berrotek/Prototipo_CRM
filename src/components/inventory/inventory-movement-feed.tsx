const movements: Array<{
  id: string
  product: string
  location: string
  type: string
  qty: string
  notes?: string
}> = []

export function InventoryMovementFeed() {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950">
      <div className="border-b border-neutral-800 p-5">
        <h2 className="text-base font-semibold text-white">Recent stock movements</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Pull this from stock_movements and sort by created_at descending.
        </p>
      </div>

      <div className="p-5">
        {movements.length ? (
          <div className="space-y-3">
            {movements.map((movement) => (
              <div key={movement.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium text-white">{movement.product}</div>
                  <div className="text-sm text-neutral-400">{movement.type}</div>
                </div>
                <div className="mt-2 text-sm text-neutral-400">
                  {movement.location} · {movement.qty}
                </div>
                {movement.notes ? <div className="mt-2 text-sm text-neutral-500">{movement.notes}</div> : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-500">
            No movements yet.
          </div>
        )}
      </div>
    </section>
  )
}
