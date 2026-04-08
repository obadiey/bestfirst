import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!user.phone) {
    return NextResponse.json(
      { error: "Add a phone number to your profile first" },
      { status: 400 }
    );
  }

  const { id } = await params;

  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }
  if (experience.status !== "MATCHED") {
    return NextResponse.json(
      { error: "Experience is not matched yet" },
      { status: 400 }
    );
  }

  const isInviter = experience.winnerId === user.id;
  const isInvitee = experience.matchedInviteeId === user.id;

  if (!isInviter && !isInvitee) {
    return NextResponse.json(
      { error: "You are not part of this match" },
      { status: 403 }
    );
  }

  const updated = await prisma.experience.update({
    where: { id },
    data: isInviter
      ? { phoneSharedByInviter: true }
      : { phoneSharedByInvitee: true },
  });

  return NextResponse.json({
    phoneSharedByInviter: updated.phoneSharedByInviter,
    phoneSharedByInvitee: updated.phoneSharedByInvitee,
  });
}
