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
  winner: {
    id: string;
    name: string;
    age: number;
    bio: string;
    photo: string;
    occupation: string;
  } | null;
  optIns: { id: string }[];
};

export default function InviteeBrowse() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [opting, setOpting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch("/api/experiences?view=invitee")
      .then((r) => r.json())
      .then((data) => {
        setExperiences(data.experiences || []);
        setLoading(false);
      });
  }, []);

  async function optIn(experienceId: string) {
    setOpting(experienceId);
    setFeedback("");
    const res = await fetch("/api/optins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceId,
        message: messages[experienceId] || "",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFeedback(data.error);
    } else {
      setFeedback("You're in! The inviter will review and choose soon.");
      const updated = await fetch("/api/experiences?view=invitee").then((r) =>
        r.json()
      );
      setExperiences(updated.experiences || []);
    }
    setOpting(null);
  }

  if (loading) return <p className="text-gray-400">Loading dates...</p>;

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        No dates available right now. Check back soon!
      </div>
    );
  }

  return (
    <div>
      {feedback && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm ${
            feedback.includes("in!")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {feedback}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => {
          const alreadyOptedIn = exp.optIns.length > 0;
          return (
            <ExperienceCard key={exp.id} experience={exp} role="INVITEE">
              {alreadyOptedIn ? (
                <p className="text-sm text-green-600 font-medium mt-2">
                  ✓ You&apos;ve opted in
                </p>
              ) : exp.status === "ASSIGNED" ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    placeholder="Say something to introduce yourself (optional)"
                    value={messages[exp.id] || ""}
                    onChange={(e) =>
                      setMessages({ ...messages, [exp.id]: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    rows={2}
                  />
                  <button
                    onClick={() => optIn(exp.id)}
                    disabled={opting === exp.id}
                    className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    {opting === exp.id ? "..." : "I'm Interested!"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-2">Already matched</p>
              )}
            </ExperienceCard>
          );
        })}
      </div>
    </div>
  );
}
