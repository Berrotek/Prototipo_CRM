'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { onboardingSchema, type OnboardingFormValues } from '@/lib/onboarding/schemas'
import { createClient } from '@/lib/supabase/client'

type Props = {
  email?: string | null
  fullName?: string | null
}

const currencyOptions = ['MXN', 'USD', 'EUR', 'COP', 'CLP'] as const
const timezoneOptions = ['America/Monterrey', 'America/Mexico_City', 'UTC', 'America/Chicago'] as const
const localeOptions = ['es', 'en'] as const

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function OrganizationOnboardingForm({ email, fullName }: Props) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = useMemo<OnboardingFormValues>(
    () => ({
      name: fullName ? `${fullName.split(' ')[0] ?? 'My'} Company` : 'My Company',
      slug: '',
      legalName: '',
      taxId: '',
      billingEmail: email ?? '',
      currency: 'MXN',
      timezone: 'America/Monterrey',
      locale: 'es',
      allowNegativeStock: false,
      analyticsEnabled: true,
    }),
    [email, fullName]
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormValues>({ defaultValues })

  const orgName = watch('name')

  const onSubmit = async (values: OnboardingFormValues) => {
    setSubmitError(null)

    const parsed = onboardingSchema.safeParse(values)
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? 'Invalid form')
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('create_organization_with_owner', {
        p_name: parsed.data.name,
        p_slug: parsed.data.slug || null,
        p_settings: {
          currency: parsed.data.currency,
          timezone: parsed.data.timezone,
          locale: parsed.data.locale,
          allow_negative_stock: parsed.data.allowNegativeStock,
          features: {
            analytics: parsed.data.analyticsEnabled,
            ai_predictions: false,
          },
        },
      })

      if (error) {
        setSubmitError(error.message)
        return
      }

      toast.success('Organization created')
      router.replace('/dashboard')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Organization name</label>
          <input
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600"
            placeholder="Northwind Logistics"
            {...register('name', {
              onChange: (event) => {
                const current = event.target.value
                if (!watch('slug')) {
                  setValue('slug', slugify(current))
                }
              },
            })}
          />
          {errors.name?.message ? <p className="mt-1 text-sm text-red-400">{errors.name.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Slug</label>
          <input
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600"
            placeholder="northwind-logistics"
            {...register('slug')}
          />
          {errors.slug?.message ? <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p> : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Legal name</label>
          <input
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600"
            placeholder="Northwind Logistics, S.A. de C.V."
            {...register('legalName')}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tax ID</label>
          <input
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600"
            placeholder="RFC / VAT / EIN"
            {...register('taxId')}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Billing email</label>
          <input
            type="email"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600"
            placeholder="billing@company.com"
            {...register('billingEmail')}
          />
          {errors.billingEmail?.message ? <p className="mt-1 text-sm text-red-400">{errors.billingEmail.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Currency</label>
          <select
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('currency')}
          >
            {currencyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Timezone</label>
          <select
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('timezone')}
          >
            {timezoneOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Language</label>
          <select
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('locale')}
          >
            {localeOptions.map((option) => (
              <option key={option} value={option}>{option.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <label className="flex items-center justify-between gap-4 text-sm text-neutral-200">
          <span>
            <span className="block font-medium text-white">Allow negative stock</span>
            <span className="block text-neutral-400">Useful for unusual receiving flows, but usually disabled.</span>
          </span>
          <input type="checkbox" className="h-4 w-4 accent-white" {...register('allowNegativeStock')} />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm text-neutral-200">
          <span>
            <span className="block font-medium text-white">Enable analytics</span>
            <span className="block text-neutral-400">Controls whether the dashboard can use the reporting layer later.</span>
          </span>
          <input type="checkbox" className="h-4 w-4 accent-white" {...register('analyticsEnabled')} />
        </label>
      </section>

      {submitError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-neutral-400">
          {orgName ? `Creating workspace for ${orgName}.` : 'Create your first workspace to continue.'}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating…' : 'Create organization'}
        </button>
      </div>
    </form>
  )
}
