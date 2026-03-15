import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (user.role !== "INVITER") {
    return NextResponse.json({ error: "Only inviters can bid" }, { status: 403 });
  }

  const { experienceId, amount } = await req.json();

  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
    include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
  });

  if (!experience || experience.status !== "OPEN") {
    return NextResponse.json({ error: "Experience not available for bidding" }, { status: 400 });
  }

  if (amount < experience.minimumBid) {
    return NextResponse.json({ error: `Minimum bid is ${experience.minimumBid} credits` }, { status: 400 });
  }

  const highestBid = experience.bids[0]?.amount || 0;
  if (amount <= highestBid) {
    return NextResponse.json({ error: `Must bid more than current highest (${highestBid} credits)` }, { status: 400 });
  }

  if (user.credits < amount) {
    return NextResponse.json({ error: "Not enough credits" }, { status: 400 });
  }

  // Upsert bid
  const bid = await prisma.bid.upsert({
    where: {
      userId_experienceId: { userId: user.id, experienceId },
    },
    create: {
      amount,
      userId: user.id,
      experienceId,
    },
    update: {
      amount,
    },
  });

  return NextResponse.json({ bid });
}

// Close bidding and declare winner (simplified: called manually or by admin)
export async function PUT(req: NextRequest) {
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

  // Deduct credits from winner, mark others as lost
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

  return NextResponse.json({ winner: winningBid.userId });
}
