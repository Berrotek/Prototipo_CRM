import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppFrame } from '@/components/app-frame'

type MembershipRow = {
  organization_id: string
  role_id: string | null
  status: string
  organizations: Array<{ id: string; name: string; slug: string | null }> | { id: string; name: string; slug: string | null } | null
  roles: Array<{ id: string; key: string; name: string; permissions: Record<string, boolean> | null }> | { id: string; key: string; name: string; permissions: Record<string, boolean> | null } | null
}

function first<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  return Array.isArray(value) ? value[0] ?? null : value
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) redirect('/sign-in')

  const { data } = await supabase
    .from('org_members')
    .select(`
      organization_id,
      role_id,
      status,
      organizations (id, name, slug),
      roles (id, key, name, permissions)
    `)
    .eq('user_id', userData.user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  if (!data?.length) redirect('/onboarding/organization')

  const memberships = (data as MembershipRow[]).map((m) => {
    const organization = first(m.organizations)
    const role = first(m.roles)

    return {
      organization_id: m.organization_id,
      organizations: organization
        ? {
            id: organization.id,
            name: organization.name,
            slug: organization.slug ?? null,
          }
        : null,
      roles: role
        ? {
            id: role.id,
            key: role.key,
            name: role.name,
            permissions: (role.permissions ?? {}) as Record<string, boolean>,
          }
        : null,
    }
  })

  return (
    <AppFrame user={userData.user} memberships={memberships}>
      {children}
    </AppFrame>
  )
}
