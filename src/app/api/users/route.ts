import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name ?? user.name,
      bio: body.bio ?? user.bio,
      photo: body.photo ?? user.photo,
      location: body.location ?? user.location,
      occupation: body.occupation ?? user.occupation,
      interests: body.interests ?? user.interests,
      age: body.age ?? user.age,
    },
  });

  return NextResponse.json({ user: updated });
}
