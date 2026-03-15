"use client";

import { useEffect, useState } from "react";
import ExperienceCard from "@/components/ExperienceCard";

type Experience = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateTime: string;
  image: string;
  minimumBid: number;
  status: string;
  isCustom: boolean;
  bids: { amount: number }[];
  _count: { bids: number };
};

export default function InviterBrowse() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [bidding, setBidding] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/experiences?view=inviter")
      .then((r) => r.json())
      .then((data) => {
        setExperiences(data.experiences || []);
        setLoading(false);
      });
  }, []);

  async function placeBid(experienceId: string) {
    const amount = parseInt(bidAmounts[experienceId] || "0");
    if (!amount) return;

    setBidding(experienceId);
    setMessage("");
    const res = await fetch("/api/bids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experienceId, amount }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
    } else {
      setMessage("Bid placed successfully!");
      // Refresh
      const updated = await fetch("/api/experiences?view=inviter").then((r) =>
        r.json()
      );
      setExperiences(updated.experiences || []);
    }
    setBidding(null);
  }

  if (loading) return <p className="text-gray-400">Loading experiences...</p>;

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        No experiences available right now. Check back soon!
      </div>
    );
  }

  return (
    <div>
      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm ${
            message.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} role="INVITER">
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                placeholder={`Min ${exp.minimumBid}`}
                value={bidAmounts[exp.id] || ""}
                onChange={(e) =>
                  setBidAmounts({ ...bidAmounts, [exp.id]: e.target.value })
                }
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                min={exp.minimumBid}
              />
              <button
                onClick={() => placeBid(exp.id)}
                disabled={bidding === exp.id}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50"
              >
                {bidding === exp.id ? "..." : "Bid"}
              </button>
            </div>
          </ExperienceCard>
        ))}
      </div>
    </div>
  );
}
