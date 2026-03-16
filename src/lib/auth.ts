import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getActiveRole(userRole: string): Promise<string> {
  const cookieStore = cookies();
  const activeRole = cookieStore.get("activeRole")?.value;
  if (activeRole === "INVITER" || activeRole === "INVITEE") return activeRole;
  return userRole;
}

export async function getCurrentUserWithRole() {
  const user = await getCurrentUser();
  if (!user) return null;
  const activeRole = await getActiveRole(user.role);
  return { ...user, activeRole };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
