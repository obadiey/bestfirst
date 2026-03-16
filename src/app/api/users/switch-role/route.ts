import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { role } = await req.json();
  if (role !== "INVITER" && role !== "INVITEE") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  let updatedUser = user;

  // Auto-grant 500 credits when switching to INVITER for the first time
  if (role === "INVITER" && user.credits === 0) {
    updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { credits: 500 },
    });
  }

  cookies().set("activeRole", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });

  return NextResponse.json({ user: { ...updatedUser, activeRole: role } });
}
