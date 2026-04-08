import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Only include phone when both parties have consented to share.
function stripPhoneUnlessBothShared<T extends { phone?: string | null } | null>(
  user: T,
  bothShared: boolean
): T {
  if (!user) return user;
  if (bothShared) return user;
  return { ...user, phone: "" };
}

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

  // Strip matched invitee phone unless both parties have shared.
  const scrubbedWon = wonExperiences.map((exp) => {
    const bothShared = exp.phoneSharedByInviter && exp.phoneSharedByInvitee;
    return {
      ...exp,
      matchedInvitee: stripPhoneUnlessBothShared(exp.matchedInvitee, bothShared),
    };
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

  // Strip winner's phone from opt-ins unless both parties have shared.
  const scrubbedOptIns = optIns.map((opt) => {
    const bothShared =
      opt.experience.phoneSharedByInviter && opt.experience.phoneSharedByInvitee;
    return {
      ...opt,
      experience: {
        ...opt.experience,
        winner: stripPhoneUnlessBothShared(opt.experience.winner, bothShared),
      },
    };
  });

  return NextResponse.json({
    wonExperiences: scrubbedWon,
    activeBids,
    optIns: scrubbedOptIns,
  });
}
