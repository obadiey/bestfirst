import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const view = searchParams.get("view"); // "inviter" | "invitee"

  if (view === "invitee") {
    // Invitees see experiences that have been won (ASSIGNED status) with winner profile
    const experiences = await prisma.experience.findMany({
      where: { status: { in: ["ASSIGNED", "MATCHED"] } },
      include: {
        winner: true,
        optIns: { where: { userId: user.id } },
      },
      orderBy: { dateTime: "asc" },
    });
    return NextResponse.json({ experiences });
  }

  // Inviters see OPEN experiences they can bid on
  const experiences = await prisma.experience.findMany({
    where: { status: "OPEN" },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
      _count: { select: { bids: true } },
    },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json({ experiences });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (user.role !== "INVITER") {
    return NextResponse.json({ error: "Only inviters can create experiences" }, { status: 403 });
  }

  // Check weekly custom experience limit
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentCustom = await prisma.experience.count({
    where: {
      createdById: user.id,
      isCustom: true,
      createdAt: { gte: oneWeekAgo },
    },
  });
  if (recentCustom >= 1) {
    return NextResponse.json(
      { error: "You can only create one custom experience per week" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const experience = await prisma.experience.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category || "Custom",
      location: body.location,
      dateTime: new Date(body.dateTime),
      image: body.image || "",
      isCustom: true,
      status: "ASSIGNED",
      minimumBid: 0,
      createdById: user.id,
      winnerId: user.id, // Creator automatically wins their own custom experience
    },
  });

  return NextResponse.json({ experience });
}
