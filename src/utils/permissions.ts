import type { UserRole, Permission, AuthUser } from '@/types';

/**
 * Role hierarchy and default permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'manage_users',
    'manage_content',
    'manage_materials',
    'moderate_chat',
    'edit_any_profile',
    'delete_content',
    'view_analytics',
  ],
  moderator: [
    'moderate_chat',
    'delete_content',
    'view_analytics',
  ],
  editor: [
    'manage_content',
    'manage_materials',
  ],
  user: [],
};

/**
 * Role display names
 */
export const ROLE_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  moderator: 'Moderator',
  editor: 'Editor',
  user: 'User',
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Full access to all features and settings',
  moderator: 'Can moderate content and manage community',
  editor: 'Can create and manage content',
  user: 'Standard user access',
};

/**
 * Permission display names
 */
export const PERMISSION_NAMES: Record<Permission, string> = {
  manage_users: 'Manage Users',
  manage_content: 'Manage Content',
  manage_materials: 'Manage Library',
  moderate_chat: 'Moderate Chat',
  edit_any_profile: 'Edit Any Profile',
  delete_content: 'Delete Content',
  view_analytics: 'View Analytics',
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false;

  // Admin has all permissions
  if (user.role === 'admin') return true;

  // Check explicit permissions
  if (user.permissions?.includes(permission)) return true;

  // Check role-based permissions
  if (user.role && ROLE_PERMISSIONS[user.role]?.includes(permission)) return true;

  return false;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: AuthUser | null): Permission[] {
  if (!user) return [];

  const rolePermissions = user.role ? ROLE_PERMISSIONS[user.role] || [] : [];
  const explicitPermissions = user.permissions || [];

  // Combine and deduplicate
  return Array.from(new Set([...rolePermissions, ...explicitPermissions]));
}
