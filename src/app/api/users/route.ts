import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getActiveRole } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const activeRole = await getActiveRole(user.role);

  const photos = await prisma.profilePhoto.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });
  const prompts = await prisma.profilePrompt.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ user: { ...user, activeRole, photos, prompts } });
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
      phone: body.phone ?? user.phone,
      age: body.age ?? user.age,
    },
  });

  // Update photos if provided
  if (body.photos !== undefined) {
    await prisma.profilePhoto.deleteMany({ where: { userId: user.id } });
    if (body.photos.length > 0) {
      await prisma.profilePhoto.createMany({
        data: body.photos.slice(0, 4).map((url: string, i: number) => ({
          userId: user.id,
          url,
          order: i,
        })),
      });
      // Set primary photo to first photo
      if (body.photos[0]) {
        await prisma.user.update({
          where: { id: user.id },
          data: { photo: body.photos[0] },
        });
      }
    }
  }

  // Update prompts if provided
  if (body.prompts !== undefined) {
    await prisma.profilePrompt.deleteMany({ where: { userId: user.id } });
    if (body.prompts.length > 0) {
      await prisma.profilePrompt.createMany({
        data: body.prompts
          .slice(0, 3)
          .filter((p: { prompt: string; answer: string }) => p.prompt && p.answer)
          .map((p: { prompt: string; answer: string }, i: number) => ({
            userId: user.id,
            prompt: p.prompt,
            answer: p.answer,
            order: i,
          })),
      });
    }
  }

  const photos = await prisma.profilePhoto.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });
  const prompts = await prisma.profilePrompt.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ user: { ...updated, photos, prompts } });
}
