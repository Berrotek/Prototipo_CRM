
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-400">Access your organization workspace.</p>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white" placeholder="Email" />
          <input className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white" type="password" placeholder="Password" />
          <button className="w-full rounded-md bg-white px-3 py-2 font-medium text-black">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}