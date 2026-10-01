export type UserRole = 'admin' | 'manager' | 'auditor';

export interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  organizationId: string;
}

export function getSessionFromCookie(cookieString: string): { uid: string; role: UserRole; name: string; email: string; organizationId: string; } | null {
  const match = cookieString.match(/audiment_session=([^;]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match[1]));
    if (!data.organizationId) return null;
    return {
      uid: data.uid,
      role: data.role,
      name: data.name,
      email: data.email,
      organizationId: data.organizationId
    };
  } catch {
    return null;
  }
}
