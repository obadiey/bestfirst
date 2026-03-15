import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (user.role === "INVITER") {
    // Get experiences I've won or bid on
    const wonExperiences = await prisma.experience.findMany({
      where: { winnerId: user.id },
      include: {
        optIns: { include: { user: true } },
        matchedInvitee: true,
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

    return NextResponse.json({ wonExperiences, activeBids });
  }

  // Invitee: get experiences I've opted into
  const optIns = await prisma.optIn.findMany({
    where: { userId: user.id },
    include: {
      experience: {
        include: { winner: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ optIns });
}
