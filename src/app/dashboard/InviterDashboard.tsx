"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileCard, { FullProfileCard } from "@/components/ProfileCard";

type ProfilePhoto = { url: string };
type ProfilePrompt = { prompt: string; answer: string };

type OptInUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  occupation: string;
  interests: string;
  location: string;
  photos: ProfilePhoto[];
  prompts: ProfilePrompt[];
};

type WonExperience = {
  id: string;
  title: string;
  category: string;
  location: string;
  dateTime: string;
  status: string;
  isCustom: boolean;
  optIns: { id: string; message: string; status: string; user: OptInUser }[];
  matchedInvitee: OptInUser | null;
};

type ActiveBid = {
  id: string;
  amount: number;
  experience: {
    id: string;
    title: string;
    category: string;
    dateTime: string;
    bids: { amount: number }[];
  };
};

export default function InviterDashboard({ compact = false }: { compact?: boolean }) {
  const [wonExperiences, setWonExperiences] = useState<WonExperience[]>([]);
  const [activeBids, setActiveBids] = useState<ActiveBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProfile, setExpandedProfile] = useState<{ user: OptInUser; experienceId: string } | null>(null);

  useEffect(() => {
    fetch("/api/experiences/mine")
      .then((r) => r.json())
      .then((data) => {
        setWonExperiences(data.wonExperiences || []);
        setActiveBids(data.activeBids || []);
        setLoading(false);
      });
  }, []);

  async function selectInvitee(experienceId: string, inviteeId: string) {
    const res = await fetch("/api/optins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experienceId, inviteeId }),
    });
    if (res.ok) {
      setExpandedProfile(null);
      const data = await fetch("/api/experiences/mine").then((r) => r.json());
      setWonExperiences(data.wonExperiences || []);
    }
  }

  if (loading) return <div className="py-8 text-center text-gray-300 text-[14px]">Loading...</div>;

  if (compact) {
    const total = wonExperiences.length + activeBids.length;
    if (total === 0) {
      return <p className="text-[14px] text-gray-400">No inviter activity yet.</p>;
    }
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-card">
        {wonExperiences.length > 0 && (
          <p className="text-[14px] text-gray-600">{wonExperiences.length} won experience{wonExperiences.length !== 1 ? "s" : ""}</p>
        )}
        {activeBids.length > 0 && (
          <p className="text-[14px] text-gray-600">{activeBids.length} active bid{activeBids.length !== 1 ? "s" : ""}</p>
        )}
        <Link href="/experiences" className="text-[14px] text-brand-600 font-medium">
          View details
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Won Experiences */}
      <section>
        <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider mb-3">
          Your Dates
        </h2>
        {wonExperiences.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-card">
            <p className="text-gray-400 text-[15px] mb-3">No won experiences yet</p>
            <Link href="/experiences" className="text-[14px] text-brand-600 font-medium">
              Browse & bid on experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wonExperiences.map((exp) => (
              <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-[16px] text-gray-900">{exp.title}</h3>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
                        exp.status === "MATCHED"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {exp.status === "MATCHED" ? "Matched" : "Awaiting"}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-400 mb-4">
                    {exp.location} · {new Date(exp.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {exp.isCustom && " · Custom"}
                  </p>

                  {/* Matched invitee */}
                  {exp.status === "MATCHED" && exp.matchedInvitee && (
                    <div className="bg-green-50 rounded-2xl p-4">
                      <ProfileCard
                        user={exp.matchedInvitee}
                        variant="mini"
                        subtitle={`Your date · ${new Date(exp.dateTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`}
                      />
                    </div>
                  )}

                  {/* Opt-ins - mini cards */}
                  {exp.status === "ASSIGNED" && (
                    <div>
                      {exp.optIns.length === 0 ? (
                        <p className="text-[14px] text-gray-400 italic">
                          No one has opted in yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[13px] font-medium text-gray-500 mb-2">
                            {exp.optIns.length} interested
                          </p>
                          {exp.optIns.map((optIn) => (
                            <ProfileCard
                              key={optIn.id}
                              user={optIn.user}
                              variant="mini"
                              subtitle={optIn.message || undefined}
                              onExpand={() => setExpandedProfile({ user: optIn.user, experienceId: exp.id })}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Bids */}
      {activeBids.length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider mb-3">
            Active Bids
          </h2>
          <div className="space-y-2">
            {activeBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-card"
              >
                <div>
                  <p className="font-medium text-[15px] text-gray-900">{bid.experience.title}</p>
                  <p className="text-[13px] text-gray-400">
                    {new Date(bid.experience.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[15px] text-gray-900">{bid.amount}</p>
                  <p className="text-[12px] text-gray-400">
                    Top: {bid.experience.bids[0]?.amount || bid.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/experiences"
          className="flex-1 bg-gray-900 text-white py-3.5 rounded-2xl text-[14px] font-medium text-center hover:bg-gray-800 transition active:scale-[0.98]"
        >
          Browse Experiences
        </Link>
        <Link
          href="/experiences/create"
          className="flex-1 border border-gray-200 text-gray-700 py-3.5 rounded-2xl text-[14px] font-medium text-center hover:bg-gray-50 transition active:scale-[0.98]"
        >
          Create Date
        </Link>
      </div>

      {/* Expanded profile modal */}
      {expandedProfile && (
        <FullProfileCard
          user={expandedProfile.user}
          variant="full"
          onClose={() => setExpandedProfile(null)}
          actionButton={
            <button
              onClick={() => selectInvitee(expandedProfile.experienceId, expandedProfile.user.id)}
              className="w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[15px] font-medium hover:bg-gray-800 transition active:scale-[0.98]"
            >
              Choose {expandedProfile.user.name.split(" ")[0]}
            </button>
          }
        />
      )}
    </div>
  );
}
