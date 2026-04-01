export default function InventoryAlertsPage() {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Inventory</div>
        <h1 className="mt-2 text-2xl font-semibold text-white">Alerts</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          This page will surface low-stock, out-of-stock, and over-reserved items once the workflow is wired.
        </p>
      </section>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-400">
        No alerts yet.
      </div>
    </div>
  )
}
