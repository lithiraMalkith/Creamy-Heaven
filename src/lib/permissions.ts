import type { BuiltInRole } from '@/types'

/* ================================================================
   Permission Constants — module:action format
   ================================================================ */

export const PERMISSIONS = {
  DASHBOARD_READ:    'dashboard:read',
  PRODUCTS_READ:     'products:read',
  PRODUCTS_WRITE:    'products:write',
  PRODUCTS_DELETE:   'products:delete',
  ORDERS_READ:       'orders:read',
  ORDERS_WRITE:      'orders:write',
  ORDERS_CREATE:     'orders:create',
  CUSTOMERS_READ:    'customers:read',
  CUSTOMERS_WRITE:   'customers:write',
  INVENTORY_READ:    'inventory:read',
  INVENTORY_WRITE:   'inventory:write',
  CATEGORIES_READ:   'categories:read',
  CATEGORIES_WRITE:  'categories:write',
  CATEGORIES_DELETE: 'categories:delete',
  MESSAGES_READ:     'messages:read',
  MESSAGES_WRITE:    'messages:write',
  MESSAGES_DELETE:   'messages:delete',
  MARKETING_READ:    'marketing:read',
  MARKETING_WRITE:   'marketing:write',
  ROLES_READ:        'roles:read',
  ROLES_WRITE:       'roles:write',
  ROLES_DELETE:      'roles:delete',
  USERS_READ:        'users:read',
  USERS_WRITE:       'users:write',
  SETTINGS_READ:     'settings:read',
  SETTINGS_WRITE:    'settings:write',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/* ================================================================
   Built-In Role → Permission Mapping
   ================================================================ */

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

export const BUILT_IN_ROLE_PERMISSIONS: Record<BuiltInRole, readonly string[]> = {
  superadmin: ALL_PERMISSIONS,

  manager: [
    'dashboard:read',
    'products:read', 'products:write',
    'orders:read', 'orders:write',
    'customers:read',
    'inventory:read', 'inventory:write',
    'categories:read',
    'messages:read', 'messages:write', 'messages:delete',
    'marketing:read', 'marketing:write',
  ],

  fulfillment: [
    'dashboard:read',
    'orders:read', 'orders:write',
    'customers:read',
  ],

  support: [
    'dashboard:read',
    'orders:read',
    'customers:read',
    'messages:read', 'messages:write',
  ],
}

/* ================================================================
   Permission Check
   ================================================================ */

/**
 * Check if a role has a specific permission.
 * Superadmin bypasses all checks.
 * Built-in roles are checked against the static mapping.
 * Custom roles would need to be fetched from Firestore (handled by the caller).
 */
export function hasPermission(role: string, permission: string): boolean {
  if (role === 'superadmin') return true

  const builtInPerms = BUILT_IN_ROLE_PERMISSIONS[role as BuiltInRole]
  if (builtInPerms) {
    return builtInPerms.includes(permission)
  }

  // Custom roles: caller should fetch from Firestore /roles/{roleId}
  // and check permissions array. For now, deny by default.
  return false
}

/**
 * Get all permissions for a role.
 */
export function getPermissionsForRole(role: string): readonly string[] {
  if (role === 'superadmin') return ALL_PERMISSIONS
  return BUILT_IN_ROLE_PERMISSIONS[role as BuiltInRole] ?? []
}

/* ================================================================
   Permission Groups — for the role editor UI
   ================================================================ */

export const PERMISSION_GROUPS = [
  {
    label: 'Dashboard',
    permissions: [
      { key: 'dashboard:read', label: 'View Dashboard' },
    ],
  },
  {
    label: 'Products',
    permissions: [
      { key: 'products:read', label: 'View Products' },
      { key: 'products:write', label: 'Create / Edit Products' },
      { key: 'products:delete', label: 'Delete Products' },
    ],
  },
  {
    label: 'Orders',
    permissions: [
      { key: 'orders:read', label: 'View Orders' },
      { key: 'orders:write', label: 'Update Order Status' },
      { key: 'orders:create', label: 'Create Manual Orders' },
    ],
  },
  {
    label: 'Customers',
    permissions: [
      { key: 'customers:read', label: 'View Customers' },
      { key: 'customers:write', label: 'Edit / Delete Customers' },
    ],
  },
  {
    label: 'Inventory',
    permissions: [
      { key: 'inventory:read', label: 'View Inventory' },
      { key: 'inventory:write', label: 'Update Stock' },
    ],
  },
  {
    label: 'Categories',
    permissions: [
      { key: 'categories:read', label: 'View Categories' },
      { key: 'categories:write', label: 'Create / Edit Categories' },
      { key: 'categories:delete', label: 'Delete Categories' },
    ],
  },
  {
    label: 'Messages',
    permissions: [
      { key: 'messages:read', label: 'View Messages' },
      { key: 'messages:write', label: 'Reply to Messages' },
      { key: 'messages:delete', label: 'Delete Messages' },
    ],
  },
  {
    label: 'Marketing',
    permissions: [
      { key: 'marketing:read', label: 'View Marketing Content' },
      { key: 'marketing:write', label: 'Edit Marketing Content' },
    ],
  },
  {
    label: 'Roles & Users',
    permissions: [
      { key: 'roles:read', label: 'View Roles' },
      { key: 'roles:write', label: 'Create / Edit Roles' },
      { key: 'roles:delete', label: 'Delete Roles' },
      { key: 'users:read', label: 'View Users' },
      { key: 'users:write', label: 'Manage Users' },
    ],
  },
  {
    label: 'Settings',
    permissions: [
      { key: 'settings:read', label: 'View Settings' },
      { key: 'settings:write', label: 'Edit Settings' },
    ],
  },
]
