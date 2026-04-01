export type OrgPermission =
  | 'manage_org'
  | 'manage_roles'
  | 'manage_members'
  | 'manage_comments'
  | 'manage_documents'
  | 'manage_workflows'
  | 'manage_tasks'
  | 'manage_notifications'
  | 'manage_integrations'

export type PermissionMap = Record<string, boolean>

export type Membership = {
  organization_id: string
  organizations: {
    id: string
    name: string
    slug: string | null
  } | null
  roles: {
    id: string
    key: string
    name: string
    permissions: PermissionMap
  } | null
}

export function normalizePermissions(value: unknown): PermissionMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, raw]) => [key, raw === true])
  )
}

export function canAccess(
  permissions: PermissionMap | null | undefined,
  required?: OrgPermission
): boolean {
  if (!required) return true
  if (!permissions) return false
  if (permissions.all_access === true) return true
  return permissions[required] === true
}
