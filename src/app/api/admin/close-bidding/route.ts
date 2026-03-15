import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Admin endpoint to close bidding on an experience and declare winner
// In production this would be protected + automated
export async function POST(req: NextRequest) {
  const { experienceId } = await req.json();

  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
    include: { bids: { orderBy: { amount: "desc" } } },
  });

  if (!experience || experience.status !== "OPEN") {
    return NextResponse.json({ error: "Cannot close bidding" }, { status: 400 });
  }

  if (experience.bids.length === 0) {
    return NextResponse.json({ error: "No bids placed" }, { status: 400 });
  }

  const winningBid = experience.bids[0];

  await prisma.$transaction([
    prisma.user.update({
      where: { id: winningBid.userId },
      data: { credits: { decrement: winningBid.amount } },
    }),
    prisma.bid.update({
      where: { id: winningBid.id },
      data: { status: "WON" },
    }),
    ...experience.bids.slice(1).map((b) =>
      prisma.bid.update({ where: { id: b.id }, data: { status: "LOST" } })
    ),
    prisma.experience.update({
      where: { id: experienceId },
      data: { status: "ASSIGNED", winnerId: winningBid.userId },
    }),
  ]);

  return NextResponse.json({ winner: winningBid.userId, amount: winningBid.amount });
}
