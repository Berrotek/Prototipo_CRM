'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim() || null

  const currency = String(formData.get('currency') ?? 'MXN')
  const timezone = String(formData.get('timezone') ?? 'America/Monterrey')
  const locale = String(formData.get('locale') ?? 'es')
  const allow_negative_stock = formData.get('allow_negative_stock') === 'on'
  const analytics = formData.get('analytics') === 'on'
  const ai_predictions = formData.get('ai_predictions') === 'on'

  if (!name) throw new Error('Organization name is required')

  const settings = {
    currency,
    timezone,
    locale,
    allow_negative_stock,
    features: {
      analytics,
      ai_predictions,
    },
  }

  const { error } = await supabase.rpc('create_organization_with_owner', {
    p_name: name,
    p_slug: slug,
    p_settings: settings,
  })

  if (error) throw new Error(error.message)

  redirect('/dashboard')
}
