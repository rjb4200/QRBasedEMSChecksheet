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
