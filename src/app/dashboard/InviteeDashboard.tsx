"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    winner: {
      name: string;
      age: number;
      photo: string;
      bio: string;
    } | null;
  };
};

export default function InviteeDashboard({ compact = false }: { compact?: boolean }) {
  const [optIns, setOptIns] = useState<OptIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experiences/mine")
      .then((r) => r.json())
      .then((data) => {
        setOptIns(data.optIns || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;

  const matched = optIns.filter((o) => o.status === "SELECTED");
  const pending = optIns.filter((o) => o.status === "PENDING");
  const notSelected = optIns.filter((o) => o.status === "NOT_SELECTED");

  if (compact) {
    if (optIns.length === 0) {
      return <p className="text-sm text-gray-400">No invitee activity yet.</p>;
    }
    return (
      <div className="bg-gray-50 rounded-xl border p-4 space-y-2">
        {matched.length > 0 && (
          <p className="text-sm text-green-600">{matched.length} upcoming date{matched.length !== 1 ? "s" : ""}</p>
        )}
        {pending.length > 0 && (
          <p className="text-sm text-yellow-600">{pending.length} pending opt-in{pending.length !== 1 ? "s" : ""}</p>
        )}
        <Link href="/experiences" className="text-sm text-brand-600 hover:underline">
          View details →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {matched.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-green-700">
            Upcoming Dates
          </h2>
          {matched.map((opt) => (
            <div
              key={opt.id}
              className="bg-green-50 border border-green-200 rounded-xl p-6 mb-3"
            >
              <h3 className="font-semibold text-lg">{opt.experience.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {opt.experience.location} ·{" "}
                {new Date(opt.experience.dateTime).toLocaleDateString()}
              </p>
              {opt.experience.winner && (
                <div className="flex items-center gap-3">
                  <img
                    src={opt.experience.winner.photo}
                    alt={opt.experience.winner.name}
                    className="w-10 h-10 rounded-full bg-gray-200"
                  />
                  <div>
                    <p className="font-medium">
                      Date with {opt.experience.winner.name},{" "}
                      {opt.experience.winner.age}
                    </p>
                    <p className="text-sm text-gray-500">
                      {opt.experience.winner.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Awaiting Response</h2>
          {pending.map((opt) => (
            <div
              key={opt.id}
              className="bg-white border rounded-xl p-5 mb-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{opt.experience.title}</p>
                <p className="text-sm text-gray-500">
                  {opt.experience.location} ·{" "}
                  {new Date(opt.experience.dateTime).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          ))}
        </section>
      )}

      {notSelected.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-400">
            Not Selected
          </h2>
          {notSelected.map((opt) => (
            <div
              key={opt.id}
              className="bg-gray-50 border rounded-xl p-5 mb-3 opacity-60"
            >
              <p className="font-medium">{opt.experience.title}</p>
              <p className="text-sm text-gray-500">
                {opt.experience.location} ·{" "}
                {new Date(opt.experience.dateTime).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      )}

      {optIns.length === 0 && (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
          <p className="mb-3">You haven&apos;t opted into any dates yet.</p>
          <Link
            href="/experiences"
            className="text-brand-600 font-medium hover:underline"
          >
            Browse available dates →
          </Link>
        </div>
      )}

      <Link
        href="/experiences"
        className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition"
      >
        Browse Dates
      </Link>
    </div>
  );
}
