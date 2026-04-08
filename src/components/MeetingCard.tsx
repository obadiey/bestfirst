"use client";

import { useState } from "react";
import Link from "next/link";
import { FullProfileCard } from "./ProfileCard";

type ProfilePhoto = { url: string };
type ProfilePrompt = { prompt: string; answer: string };

type OtherUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  occupation?: string;
  interests?: string;
  location?: string;
  phone?: string;
  photos?: ProfilePhoto[];
  prompts?: ProfilePrompt[];
};

type Experience = {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  phoneSharedByInviter: boolean;
  phoneSharedByInvitee: boolean;
};

type Props = {
  experience: Experience;
  otherUser: OtherUser;
  perspective: "inviter" | "invitee";
  currentUserHasPhone: boolean;
  onShared: () => void;
};

function formatMeetingDate(iso: string) {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateStr} · ${timeStr}`;
}

function relativeLabel(iso: string): string | null {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Past";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `in ${diffDays} days`;
  if (diffDays < 14) return "next week";
  return `in ${diffDays} days`;
}

export default function MeetingCard({
  experience,
  otherUser,
  perspective,
  currentUserHasPhone,
  onShared,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mySharedFlag =
    perspective === "inviter"
      ? experience.phoneSharedByInviter
      : experience.phoneSharedByInvitee;
  const theirSharedFlag =
    perspective === "inviter"
      ? experience.phoneSharedByInvitee
      : experience.phoneSharedByInviter;
  const bothShared = mySharedFlag && theirSharedFlag;
  const otherPhone = otherUser.phone || "";

  async function handleShareNumber() {
    setSharing(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/experiences/${experience.id}/share-phone`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't share number");
      } else {
        onShared();
      }
    } catch {
      setError("Network error");
    } finally {
      setSharing(false);
    }
  }

  const rel = relativeLabel(experience.dateTime);
  const photoUrl = otherUser.photos?.[0]?.url || otherUser.photo;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {/* Date banner */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wider">
                {formatMeetingDate(experience.dateTime)}
              </p>
              <h3 className="font-semibold text-[17px] text-gray-900 mt-1">
                {experience.title}
              </h3>
              <p className="text-[13px] text-gray-500 mt-0.5">
                {experience.location}
              </p>
            </div>
            {rel && (
              <span className="text-[11px] font-medium bg-gray-900 text-white px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                {rel}
              </span>
            )}
          </div>
        </div>

        {/* Other person */}
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-3 w-full text-left p-4 hover:bg-gray-50 transition active:scale-[0.99]"
        >
          <img
            src={photoUrl}
            alt={otherUser.name}
            className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
              Your date
            </p>
            <p className="font-semibold text-[15px] text-gray-900 truncate">
              {otherUser.name}, {otherUser.age}
            </p>
            <p className="text-[13px] text-gray-500 truncate">
              {otherUser.occupation || otherUser.bio?.slice(0, 60)}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-gray-300 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Contact section */}
        <div className="px-4 pb-4 pt-0">
          {bothShared && otherPhone ? (
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-[11px] text-green-700 uppercase tracking-wider font-medium mb-1">
                Contact
              </p>
              <p className="text-[15px] text-gray-900 font-medium mb-3">
                {otherPhone}
              </p>
              <div className="flex gap-2">
                <a
                  href={`tel:${otherPhone.replace(/\s/g, "")}`}
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-[14px] font-medium text-center hover:bg-gray-800 transition active:scale-[0.98]"
                >
                  Call
                </a>
                <a
                  href={`sms:${otherPhone.replace(/\s/g, "")}`}
                  className="flex-1 bg-white border border-gray-200 text-gray-900 py-2.5 rounded-xl text-[14px] font-medium text-center hover:bg-gray-50 transition active:scale-[0.98]"
                >
                  Text
                </a>
              </div>
            </div>
          ) : mySharedFlag && !theirSharedFlag ? (
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-[13px] text-amber-700">
                Waiting for {otherUser.name.split(" ")[0]} to share their number.
              </p>
            </div>
          ) : !currentUserHasPhone ? (
            <Link
              href="/profile"
              className="block bg-white border border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50 transition active:scale-[0.99]"
            >
              <p className="text-[14px] text-gray-900 font-medium">
                Add your phone
              </p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Required to share with your date
              </p>
            </Link>
          ) : (
            <button
              onClick={handleShareNumber}
              disabled={sharing}
              className="w-full bg-gray-900 text-white py-3 rounded-2xl text-[14px] font-medium hover:bg-gray-800 transition active:scale-[0.98] disabled:opacity-60"
            >
              {sharing ? "Sharing..." : "Share my number"}
            </button>
          )}
          {error && (
            <p className="text-[12px] text-red-600 mt-2 text-center">{error}</p>
          )}
        </div>
      </div>

      {expanded && (
        <FullProfileCard
          user={otherUser}
          variant="full"
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
}
