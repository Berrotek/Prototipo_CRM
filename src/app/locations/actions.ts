'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createLocation(formData: FormData) {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  if (!name) throw new Error('Location name is required')

  const code = String(formData.get('code') ?? '').trim() || null
  const location_type = String(formData.get('location_type') ?? 'warehouse')
  const timezone = String(formData.get('timezone') ?? '').trim() || null
  const contact_name = String(formData.get('contact_name') ?? '').trim() || null
  const contact_phone = String(formData.get('contact_phone') ?? '').trim() || null
  const contact_email = String(formData.get('contact_email') ?? '').trim() || null
  const metadata_raw = String(formData.get('metadata') ?? '').trim()
  const address_raw = String(formData.get('address_data') ?? '').trim()

  const metadata = metadata_raw ? JSON.parse(metadata_raw) : {}
  const address_data = address_raw ? JSON.parse(address_raw) : {}

  const { error } = await supabase.from('locations').insert({
    code,
    name,
    location_type,
    timezone,
    contact_name,
    contact_phone,
    contact_email,
    metadata,
    address_data,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/locations')
}
