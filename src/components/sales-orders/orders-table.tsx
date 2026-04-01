const rows: Array<{
  id: string
  order_no: string
  customer: string
  status: string
  fulfillment: string
  total: string
}> = []

export function OrdersTable() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950">
      <div className="border-b border-neutral-800 p-5">
        <h2 className="text-base font-semibold text-white">Sales orders</h2>
        <p className="mt-1 text-sm text-neutral-400">
          This will become the main outbound workflow: order creation, line items, fulfillment location, and progress tracking.
        </p>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-800 text-sm">
          <thead className="text-left text-neutral-400">
            <tr>
              <th className="px-5 py-3 font-medium">Order #</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Fulfillment</th>
              <th className="px-5 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {rows.length ? rows.map((row) => (
              <tr key={row.id}>
                <td className="px-5 py-3 text-white">{row.order_no}</td>
                <td className="px-5 py-3 text-neutral-300">{row.customer}</td>
                <td className="px-5 py-3 text-neutral-300">{row.status}</td>
                <td className="px-5 py-3 text-neutral-300">{row.fulfillment}</td>
                <td className="px-5 py-3 text-neutral-300">{row.total}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-neutral-500">
                  No sales orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
