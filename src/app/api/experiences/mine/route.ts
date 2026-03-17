import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const wonExperiences = await prisma.experience.findMany({
    where: { winnerId: user.id },
    include: {
      optIns: {
        include: {
          user: {
            include: {
              photos: { orderBy: { order: "asc" } },
              prompts: { orderBy: { order: "asc" } },
            },
          },
        },
      },
      matchedInvitee: {
        include: {
          photos: { orderBy: { order: "asc" } },
          prompts: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { dateTime: "asc" },
  });

  const activeBids = await prisma.bid.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: {
      experience: {
        include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
      },
    },
  });

  const optIns = await prisma.optIn.findMany({
    where: { userId: user.id },
    include: {
      experience: {
        include: {
          winner: {
            include: {
              photos: { orderBy: { order: "asc" } },
              prompts: { orderBy: { order: "asc" } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wonExperiences, activeBids, optIns });
}
