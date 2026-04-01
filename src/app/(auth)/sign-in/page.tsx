'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const signInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignInValues>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: SignInValues) => {
    setSubmitError(null)

    const parsed = signInSchema.safeParse(values)
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? 'Invalid form')
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      })

      if (error) {
        setSubmitError(error.message)
        return
      }

      toast.success('Signed in')
      router.push('/dashboard')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Welcome back</div>
        <h1 className="mt-3 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Access your workspace using your organization account.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            autoComplete="current-password"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            {...register('password')}
          />
          {errors.password?.message ? <p className="mt-1 text-sm text-red-400">{errors.password.message}</p> : null}
        </div>

        {submitError ? (
          <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-white px-3 py-2 font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-neutral-400 hover:text-white">
          Forgot password?
        </Link>
        <Link href="/sign-up" className="text-neutral-400 hover:text-white">
          Create account
        </Link>
      </div>
    </section>
  )
}
