"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OptInUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  occupation: string;
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

export default function InviterDashboard() {
  const [wonExperiences, setWonExperiences] = useState<WonExperience[]>([]);
  const [activeBids, setActiveBids] = useState<ActiveBid[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Refresh
      const data = await fetch("/api/experiences/mine").then((r) => r.json());
      setWonExperiences(data.wonExperiences || []);
    }
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="space-y-10">
      {/* Won Experiences - need to pick invitee */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Your Date Experiences</h2>
        {wonExperiences.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
            <p className="mb-3">No won experiences yet.</p>
            <Link
              href="/experiences"
              className="text-brand-600 font-medium hover:underline"
            >
              Browse & bid on experiences →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wonExperiences.map((exp) => (
              <div key={exp.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-sm text-gray-500">
                      {exp.location} · {new Date(exp.dateTime).toLocaleDateString()}
                      {exp.isCustom && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          Custom
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      exp.status === "MATCHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {exp.status === "MATCHED" ? "Matched!" : "Awaiting opt-ins"}
                  </span>
                </div>

                {exp.status === "MATCHED" && exp.matchedInvitee && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <img
                      src={exp.matchedInvitee.photo}
                      alt={exp.matchedInvitee.name}
                      className="w-12 h-12 rounded-full bg-gray-200"
                    />
                    <div>
                      <p className="font-medium">
                        Your date: {exp.matchedInvitee.name}, {exp.matchedInvitee.age}
                      </p>
                      <p className="text-sm text-gray-500">{exp.matchedInvitee.bio}</p>
                    </div>
                  </div>
                )}

                {exp.status === "ASSIGNED" && (
                  <div>
                    {exp.optIns.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">
                        No one has opted in yet. Check back soon!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-600">
                          {exp.optIns.length} interested — choose your date:
                        </p>
                        {exp.optIns.map((optIn) => (
                          <div
                            key={optIn.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={optIn.user.photo}
                                alt={optIn.user.name}
                                className="w-10 h-10 rounded-full bg-gray-200"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {optIn.user.name}, {optIn.user.age}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {optIn.message || optIn.user.bio.slice(0, 60)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => selectInvitee(exp.id, optIn.user.id)}
                              className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition"
                            >
                              Choose
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Bids */}
      {activeBids.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Active Bids</h2>
          <div className="space-y-3">
            {activeBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white rounded-xl border p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{bid.experience.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(bid.experience.dateTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-600">
                    Your bid: {bid.amount}
                  </p>
                  <p className="text-xs text-gray-400">
                    Highest: {bid.experience.bids[0]?.amount || bid.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-3">
        <Link
          href="/experiences"
          className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition"
        >
          Browse Experiences
        </Link>
        <Link
          href="/experiences/create"
          className="border-2 border-brand-600 text-brand-600 px-6 py-3 rounded-lg font-medium hover:bg-brand-50 transition"
        >
          Create Custom Date
        </Link>
      </div>
    </div>
  );
}
