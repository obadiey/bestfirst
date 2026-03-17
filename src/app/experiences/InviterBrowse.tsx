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
      setMessage("Bid placed!");
      const updated = await fetch("/api/experiences?view=inviter").then((r) => r.json());
      setExperiences(updated.experiences || []);
    }
    setBidding(null);
  }

  if (loading) return <div className="py-12 text-center text-gray-300 text-[14px]">Loading experiences...</div>;

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-card">
        <p className="text-gray-400 text-[15px]">No experiences available right now</p>
      </div>
    );
  }

  return (
    <div>
      {message && (
        <div
          className={`mb-4 p-3.5 rounded-2xl text-[14px] font-medium ${
            message.includes("placed")
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-4">
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
                className="flex-1 bg-gray-50 border-0 rounded-xl px-3.5 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
                min={exp.minimumBid}
              />
              <button
                onClick={() => placeBid(exp.id)}
                disabled={bidding === exp.id}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-gray-800 transition disabled:opacity-40 active:scale-[0.98]"
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
