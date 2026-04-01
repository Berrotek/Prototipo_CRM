import Link from 'next/link'

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Access denied</div>
        <h1 className="mt-3 text-2xl font-semibold text-white">You do not have permission to view this page</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Your current organization role does not grant access to this area. Ask an owner or administrator to update your role permissions.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="rounded-md bg-white px-4 py-2 font-medium text-black">
            Go to dashboard
          </Link>
          <Link href="/settings" className="rounded-md border border-neutral-800 px-4 py-2 font-medium text-neutral-200">
            Account settings
          </Link>
        </div>
      </div>
    </div>
  )
}
