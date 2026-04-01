import { createClient } from '@/lib/supabase/server'
import { MasterDataPage } from '@/components/master-data-page'
import { createLocation } from './actions'

export default async function LocationsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('locations')
    .select('id, code, name, location_type, timezone, contact_email, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = (data ?? []) as Array<{
    id: string
    code: string | null
    name: string
    location_type: string
    timezone: string | null
    contact_email: string | null
    is_active: boolean
    created_at: string
  }>

  return (
    <MasterDataPage
      title="Locations"
      description="Warehouse, store, office, and 3PL records that anchor inventory and fulfillment."
      stats={[
        { label: 'Total locations', value: rows.length },
        { label: 'Active', value: rows.filter((r) => r.is_active).length },
        { label: 'Warehouses', value: rows.filter((r) => r.location_type === 'warehouse').length },
        { label: 'Stores / offices', value: rows.filter((r) => r.location_type !== 'warehouse').length },
      ]}
      table={
        <div className="overflow-hidden">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Existing locations</h2>
            <p className="mt-1 text-sm text-neutral-400">The first operational record set for stock and shipping.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr className="border-b border-neutral-800">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Timezone</th>
                  <th className="py-3 pr-4">Active</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-neutral-300">{row.code ?? '—'}</td>
                    <td className="py-3 pr-4 text-white">{row.name}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.location_type}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.timezone ?? '—'}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.is_active ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No locations yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      }
      form={
        <form action={createLocation} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Create location</h2>
            <p className="mt-1 text-sm text-neutral-400">Use this for warehouses, stores, offices, or 3PL nodes.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Code</label>
            <input name="code" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder="WH-MTY-01" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Name</label>
            <input name="name" required className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder="Monterrey Warehouse" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Type</label>
            <select name="location_type" defaultValue="warehouse" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white">
              <option value="warehouse">warehouse</option>
              <option value="store">store</option>
              <option value="office">office</option>
              <option value="3pl">3pl</option>
              <option value="virtual">virtual</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Timezone</label>
            <input name="timezone" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder="America/Monterrey" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Contact name</label>
              <input name="contact_name" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Contact phone</label>
              <input name="contact_phone" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Contact email</label>
            <input name="contact_email" type="email" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Address data JSON</label>
            <textarea name="address_data" rows={4} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder='{"street":"...","city":"..."}' />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Metadata JSON</label>
            <textarea name="metadata" rows={3} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder='{"dock_count":2}' />
          </div>

          <button className="rounded-md bg-white px-4 py-2 font-medium text-black">Create location</button>
        </form>
      }
      help={
        <>
          <p>Locations drive inventory levels, reservations, shipments, and fulfillment routing. The schema already models location type, address data, contacts, timezone, and active state. fileciteturn2file4</p>
          <p className="mt-2">This is the first screen that should feel operational rather than administrative.</p>
        </>
      }
    />
  )
}
