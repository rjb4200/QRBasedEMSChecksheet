export type AppRole = "user" | "supervisor" | "admin";

const roleRank: Record<AppRole, number> = {
  user: 1,
  supervisor: 2,
  admin: 3,
};

export function hasRole(currentRole: AppRole | null | undefined, requiredRole: AppRole) {
  if (!currentRole) {
    return false;
  }

  return roleRank[currentRole] >= roleRank[requiredRole];
}

export function isWinchesterGoogleUser(provider: string | undefined, email: string | undefined) {
  if (provider !== "google") {
    return true;
  }

  return email?.toLowerCase().endsWith("@winchesterky.com") ?? false;
}
