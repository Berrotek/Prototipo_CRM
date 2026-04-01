'use client'

import { useFormStatus } from 'react-dom'
import { createOrganization } from '@/app/onboarding/organization/actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-white px-4 py-2 font-medium text-black disabled:opacity-60"
    >
      {pending ? 'Creating…' : 'Create organization'}
    </button>
  )
}

export function OrganizationForm() {
  return (
    <form action={createOrganization} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Organization name</label>
          <input
            name="name"
            required
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
            placeholder="Acme Logistics"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Slug</label>
          <input
            name="slug"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
            placeholder="acme-logistics"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Currency</label>
          <select
            name="currency"
            defaultValue="MXN"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Timezone</label>
          <select
            name="timezone"
            defaultValue="America/Monterrey"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          >
            <option value="America/Monterrey">America/Monterrey</option>
            <option value="America/Mexico_City">America/Mexico_City</option>
            <option value="America/New_York">America/New_York</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Locale</label>
          <select
            name="locale"
            defaultValue="es"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          >
            <option value="es">es</option>
            <option value="en">en</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <div className="text-sm font-medium text-neutral-200">Workspace settings</div>

        <label className="flex items-center justify-between gap-4 text-sm text-neutral-300">
          <span>Allow negative stock</span>
          <input name="allow_negative_stock" type="checkbox" className="h-4 w-4" />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm text-neutral-300">
          <span>Enable analytics</span>
          <input name="analytics" type="checkbox" defaultChecked className="h-4 w-4" />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm text-neutral-300">
          <span>Enable AI predictions</span>
          <input name="ai_predictions" type="checkbox" className="h-4 w-4" />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <p className="text-xs text-neutral-500">
          This creates the organization, owner role, and your first membership.
        </p>
      </div>
    </form>
  )
}
