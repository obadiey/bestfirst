"use client";

import { useEffect, useState } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import { FullProfileCard } from "@/components/ProfileCard";

type ProfilePhoto = { url: string };
type ProfilePrompt = { prompt: string; answer: string };

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
    interests: string;
    location: string;
    photos: ProfilePhoto[];
    prompts: ProfilePrompt[];
  } | null;
  optIns: { id: string }[];
};

export default function InviteeBrowse() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [opting, setOpting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [viewingProfile, setViewingProfile] = useState<Experience["winner"] | null>(null);

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
      const updated = await fetch("/api/experiences?view=invitee").then((r) => r.json());
      setExperiences(updated.experiences || []);
    }
    setOpting(null);
  }

  if (loading) return <div className="py-12 text-center text-gray-300 text-[14px]">Loading dates...</div>;

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-card">
        <p className="text-gray-400 text-[15px]">No dates available right now</p>
      </div>
    );
  }

  return (
    <div>
      {feedback && (
        <div
          className={`mb-4 p-3.5 rounded-2xl text-[14px] font-medium ${
            feedback.includes("in!")
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {feedback}
        </div>
      )}
      <div className="space-y-4">
        {experiences.map((exp) => {
          const alreadyOptedIn = exp.optIns.length > 0;
          return (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              role="INVITEE"
              onViewProfile={exp.winner ? () => setViewingProfile(exp.winner) : undefined}
            >
              {alreadyOptedIn ? (
                <div className="flex items-center gap-2 mt-2 py-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-green-600 font-medium">Opted in</p>
                </div>
              ) : exp.status === "ASSIGNED" ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    placeholder="Introduce yourself (optional)"
                    value={messages[exp.id] || ""}
                    onChange={(e) =>
                      setMessages({ ...messages, [exp.id]: e.target.value })
                    }
                    className="w-full bg-gray-50 border-0 rounded-xl px-3.5 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => optIn(exp.id)}
                    disabled={opting === exp.id}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl text-[14px] font-medium hover:bg-gray-800 transition disabled:opacity-40 active:scale-[0.98]"
                  >
                    {opting === exp.id ? "..." : "I'm Interested"}
                  </button>
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 mt-2">Already matched</p>
              )}
            </ExperienceCard>
          );
        })}
      </div>

      {/* Profile modal */}
      {viewingProfile && (
        <FullProfileCard
          user={viewingProfile}
          variant="full"
          onClose={() => setViewingProfile(null)}
        />
      )}
    </div>
  );
}
