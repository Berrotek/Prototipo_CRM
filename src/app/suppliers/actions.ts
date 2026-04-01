'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSupplier(formData: FormData) {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  if (!name) throw new Error('Supplier name is required')

  const code = String(formData.get('code') ?? '').trim() || null
  const legal_name = String(formData.get('legal_name') ?? '').trim() || null
  const email = String(formData.get('email') ?? '').trim() || null
  const phone = String(formData.get('phone') ?? '').trim() || null
  const tax_id = String(formData.get('tax_id') ?? '').trim() || null
  const status = String(formData.get('status') ?? 'active')
  const lead_time_days = Number(formData.get('lead_time_days') ?? 0)
  const address_raw = String(formData.get('address') ?? '').trim()
  const metadata_raw = String(formData.get('metadata') ?? '').trim()

  const address = address_raw ? JSON.parse(address_raw) : {}
  const metadata = metadata_raw ? JSON.parse(metadata_raw) : {}

  const { error } = await supabase.from('suppliers').insert({
    code,
    name,
    legal_name,
    email,
    phone,
    tax_id,
    status,
    lead_time_days,
    address,
    metadata,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/suppliers')
}
