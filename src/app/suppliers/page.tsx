import { createClient } from '@/lib/supabase/server'
import { MasterDataPage } from '@/components/master-data-page'
import { createSupplier } from './actions'

export default async function SuppliersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('suppliers')
    .select('id, code, name, email, status, lead_time_days, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = (data ?? []) as Array<{
    id: string
    code: string | null
    name: string
    email: string | null
    status: string
    lead_time_days: number
  }>

  return (
    <MasterDataPage
      title="Suppliers"
      description="Vendor records for purchasing, receiving, and replenishment planning."
      stats={[
        { label: 'Suppliers', value: rows.length },
        { label: 'Active', value: rows.filter((r) => r.status === 'active').length },
        { label: 'Fast lead time', value: rows.filter((r) => r.lead_time_days > 0 && r.lead_time_days <= 7).length },
        { label: 'Long lead time', value: rows.filter((r) => r.lead_time_days > 7).length },
      ]}
      table={
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Existing suppliers</h2>
            <p className="mt-1 text-sm text-neutral-400">Suppliers feed procurement and inbound receiving. fileciteturn2file1turn2file9</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr className="border-b border-neutral-800">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Lead time</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-neutral-300">{row.code ?? '—'}</td>
                    <td className="py-3 pr-4 text-white">{row.name}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.email ?? '—'}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.lead_time_days}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.status}</td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">No suppliers yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      }
      form={
        <form action={createSupplier} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Create supplier</h2>
            <p className="mt-1 text-sm text-neutral-400">Keep this lean at first; enrich it later with trading terms and certificates.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Code</label>
              <input name="code" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder="SUP-001" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Status</label>
              <select name="status" defaultValue="active" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Name</label>
            <input name="name" required className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Legal name</label>
            <input name="legal_name" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Email</label>
              <input name="email" type="email" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Phone</label>
              <input name="phone" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Tax ID</label>
              <input name="tax_id" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Lead time days</label>
              <input name="lead_time_days" type="number" defaultValue="0" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Address JSON</label>
            <textarea name="address" rows={4} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Metadata JSON</label>
            <textarea name="metadata" rows={3} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <button className="rounded-md bg-white px-4 py-2 font-medium text-black">Create supplier</button>
        </form>
      }
      help={
        <>
          <p>Suppliers are used by purchase orders, shipments, and receiving. The schema already models supplier address, lead time, tax ID, and metadata. fileciteturn2file0turn2file1</p>
        </>
      }
    />
  )
}
