import { createClient } from '@/lib/supabase/server'
import { MasterDataPage } from '@/components/master-data-page'
import { createCustomer } from './actions'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('customers')
    .select('id, code, name, email, status, payment_terms_days, credit_limit, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = (data ?? []) as Array<{
    id: string
    code: string | null
    name: string
    email: string | null
    status: string
    payment_terms_days: number
    credit_limit: number
    created_at: string
  }>

  return (
    <MasterDataPage
      title="Customers"
      description="Your accounts, credit terms, and billing identities for invoicing and collections."
      stats={[
        { label: 'Customers', value: rows.length },
        { label: 'Active', value: rows.filter((r) => r.status === 'active').length },
        { label: 'Credit enabled', value: rows.filter((r) => r.credit_limit > 0).length },
        { label: 'Net terms', value: rows.filter((r) => r.payment_terms_days > 0).length },
      ]}
      table={
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Existing customers</h2>
            <p className="mt-1 text-sm text-neutral-400">Customer master data feeds balances, invoices, and shipment destinations. fileciteturn2file4turn2file10</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr className="border-b border-neutral-800">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Terms</th>
                  <th className="py-3 pr-4">Credit limit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-neutral-300">{row.code ?? '—'}</td>
                    <td className="py-3 pr-4 text-white">{row.name}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.email ?? '—'}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.payment_terms_days}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.credit_limit}</td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">No customers yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      }
      form={
        <form action={createCustomer} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Create customer</h2>
            <p className="mt-1 text-sm text-neutral-400">Use this for B2B accounts and invoicing identities.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Code</label>
              <input name="code" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder="CUST-001" />
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
              <label className="text-sm text-neutral-300">Payment terms days</label>
              <input name="payment_terms_days" type="number" defaultValue="0" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Credit limit</label>
            <input name="credit_limit" type="number" step="0.01" defaultValue="0" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Billing address JSON</label>
            <textarea name="billing_address" rows={4} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Shipping address JSON</label>
            <textarea name="shipping_address" rows={4} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Metadata JSON</label>
            <textarea name="metadata" rows={3} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <button className="rounded-md bg-white px-4 py-2 font-medium text-black">Create customer</button>
        </form>
      }
      help={
        <>
          <p>Customers support billing and shipping addresses, credit limits, payment terms, and metadata. That lines up with invoicing and balance snapshots later. fileciteturn2file4turn2file10turn2file14</p>
        </>
      }
    />
  )
}
