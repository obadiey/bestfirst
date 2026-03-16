import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === "signup") {
    const { email, name, age, role, bio } = body;
    if (!email || !name || !age || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        email,
        name,
        age,
        role,
        bio: bio || "",
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        credits: 500,
      },
    });
    cookies().set("userId", user.id, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    cookies().set("activeRole", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    return NextResponse.json({ user });
  }

  if (body.action === "login") {
    const { email } = body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "No account found with that email" }, { status: 404 });
    }
    cookies().set("userId", user.id, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    cookies().set("activeRole", user.role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    return NextResponse.json({ user });
  }

  if (body.action === "logout") {
    cookies().delete("userId");
    cookies().delete("activeRole");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
