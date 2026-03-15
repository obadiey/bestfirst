import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Invitee opts into an experience
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (user.role !== "INVITEE") {
    return NextResponse.json({ error: "Only invitees can opt in" }, { status: 403 });
  }

  const { experienceId, message } = await req.json();

  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
  });

  if (!experience || !["ASSIGNED"].includes(experience.status)) {
    return NextResponse.json({ error: "Experience not available for opt-in" }, { status: 400 });
  }

  const optIn = await prisma.optIn.upsert({
    where: {
      userId_experienceId: { userId: user.id, experienceId },
    },
    create: {
      userId: user.id,
      experienceId,
      message: message || "",
    },
    update: {
      message: message || "",
    },
  });

  return NextResponse.json({ optIn });
}

// Inviter selects an invitee (match)
export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (user.role !== "INVITER") {
    return NextResponse.json({ error: "Only inviters can select" }, { status: 403 });
  }

  const { experienceId, inviteeId } = await req.json();

  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
  });

  if (!experience || experience.winnerId !== user.id) {
    return NextResponse.json({ error: "Not your experience" }, { status: 403 });
  }

  // Mark selected opt-in and update experience
  await prisma.$transaction([
    prisma.optIn.updateMany({
      where: { experienceId, userId: inviteeId },
      data: { status: "SELECTED" },
    }),
    prisma.optIn.updateMany({
      where: { experienceId, userId: { not: inviteeId } },
      data: { status: "NOT_SELECTED" },
    }),
    prisma.experience.update({
      where: { id: experienceId },
      data: { status: "MATCHED", matchedInviteeId: inviteeId },
    }),
  ]);

  return NextResponse.json({ matched: true });
}
