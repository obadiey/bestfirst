"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";

type ProfilePhoto = { url: string };
type ProfilePrompt = { prompt: string; answer: string };

type Winner = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  occupation: string;
  interests: string;
  location: string;
  phone?: string;
  photos: ProfilePhoto[];
  prompts: ProfilePrompt[];
};

type OptIn = {
  id: string;
  status: string;
  message: string;
  experience: {
    id: string;
    title: string;
    category: string;
    location: string;
    dateTime: string;
    status: string;
    phoneSharedByInviter: boolean;
    phoneSharedByInvitee: boolean;
    winner: Winner | null;
  };
};

export default function InviteeDashboard({
  compact = false,
  currentUserHasPhone = false,
}: {
  compact?: boolean;
  currentUserHasPhone?: boolean;
}) {
  const [optIns, setOptIns] = useState<OptIn[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const data = await fetch("/api/experiences/mine").then((r) => r.json());
    setOptIns(data.optIns || []);
  }, []);

  useEffect(() => {
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  if (loading) return <div className="py-8 text-center text-gray-300 text-[14px]">Loading...</div>;

  const matched = optIns.filter((o) => o.status === "SELECTED");
  const pending = optIns.filter((o) => o.status === "PENDING");
  const notSelected = optIns.filter((o) => o.status === "NOT_SELECTED");

  if (compact) {
    if (optIns.length === 0) {
      return <p className="text-[14px] text-gray-400">No invitee activity yet.</p>;
    }
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-card">
        {matched.length > 0 && (
          <p className="text-[14px] text-green-600">{matched.length} upcoming date{matched.length !== 1 ? "s" : ""}</p>
        )}
        {pending.length > 0 && (
          <p className="text-[14px] text-amber-600">{pending.length} pending opt-in{pending.length !== 1 ? "s" : ""}</p>
        )}
        <Link href="/experiences" className="text-[14px] text-brand-600 font-medium">
          View details
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming dates */}
      {matched.length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider mb-3">
            Upcoming Dates
          </h2>
          <div className="space-y-4">
            {matched.map(
              (opt) =>
                opt.experience.winner && (
                  <MeetingCard
                    key={opt.id}
                    experience={opt.experience}
                    otherUser={opt.experience.winner}
                    perspective="invitee"
                    currentUserHasPhone={currentUserHasPhone}
                    onShared={refetch}
                  />
                )
            )}
          </div>
        </section>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider mb-3">
            Awaiting Response
          </h2>
          <div className="space-y-2">
            {pending.map((opt) => (
              <div key={opt.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[15px] text-gray-900">{opt.experience.title}</p>
                  <p className="text-[13px] text-gray-400">
                    {opt.experience.location} · {new Date(opt.experience.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Not selected */}
      {notSelected.length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium text-gray-300 uppercase tracking-wider mb-3">
            Not Selected
          </h2>
          <div className="space-y-2">
            {notSelected.map((opt) => (
              <div key={opt.id} className="bg-gray-50 rounded-2xl p-4 opacity-60">
                <p className="font-medium text-[15px] text-gray-600">{opt.experience.title}</p>
                <p className="text-[13px] text-gray-400">
                  {opt.experience.location} · {new Date(opt.experience.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {optIns.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-card">
          <p className="text-gray-400 text-[15px] mb-3">No dates yet</p>
          <Link href="/experiences" className="text-[14px] text-brand-600 font-medium">
            Browse available dates
          </Link>
        </div>
      )}

      <Link
        href="/experiences"
        className="block w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[14px] font-medium text-center hover:bg-gray-800 transition active:scale-[0.98]"
      >
        Browse Dates
      </Link>
    </div>
  );
}
