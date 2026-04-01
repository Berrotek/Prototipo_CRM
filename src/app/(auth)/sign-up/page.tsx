'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your name'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitInfo, setSubmitInfo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpValues>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: SignUpValues) => {
    setSubmitError(null)
    setSubmitInfo(null)

    const parsed = signUpSchema.safeParse(values)
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? 'Invalid form')
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/callback?next=/onboarding/organization`
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { full_name: parsed.data.fullName },
          emailRedirectTo: redirectTo,
        },
      })

      if (error) {
        setSubmitError(error.message)
        return
      }

      if (data.session) {
        toast.success('Account created')
        router.push('/onboarding/organization')
        router.refresh()
        return
      }

      setSubmitInfo('Account created. Check your email to confirm your address.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Start here</div>
        <h1 className="mt-3 text-2xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Create your user account first, then bootstrap your organization workspace.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Full name</label>
          <input
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('fullName')}
          />
          {errors.fullName?.message ? <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('email')}
          />
          {errors.email?.message ? <p className="mt-1 text-sm text-red-400">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Password</label>
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
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
