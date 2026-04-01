'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type Values = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitInfo, setSubmitInfo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: Values) => {
    setSubmitError(null)
    setSubmitInfo(null)

    const parsed = resetPasswordSchema.safeParse(values)
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? 'Invalid form')
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: parsed.data.password,
      })

      if (error) {
        setSubmitError(error.message)
        return
      }

      setSubmitInfo('Password updated. Sign in again.')
      await supabase.auth.signOut()
      router.push('/sign-in')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Set new password</div>
        <h1 className="mt-3 text-2xl font-semibold text-white">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Choose a new password for your account.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">New password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('password')}
          />
          {errors.password?.message ? <p className="mt-1 text-sm text-red-400">{errors.password.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Confirm password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword?.message ? <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p> : null}
        </div>

        {submitError ? (
          <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {submitError}
          </p>
        ) : null}

        {submitInfo ? (
          <p className="rounded-md border border-emerald-900/50 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-300">
            {submitInfo}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-white px-3 py-2 font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <div className="mt-6 text-sm">
        <Link href="/sign-in" className="text-neutral-400 hover:text-white">
          Back to sign in
        </Link>
      </div>
    </section>
  )
}
