"use client";

import { useState } from "react";
import PhotoCarousel from "./PhotoCarousel";

type ProfilePhoto = { url: string };
type ProfilePrompt = { prompt: string; answer: string };

type ProfileUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  location?: string;
  occupation?: string;
  interests?: string;
  photos?: ProfilePhoto[];
  prompts?: ProfilePrompt[];
};

type Props = {
  user: ProfileUser;
  variant?: "mini" | "full";
  onExpand?: () => void;
  onClose?: () => void;
  actionButton?: React.ReactNode;
  subtitle?: string;
};

export function MiniProfileCard({ user, onExpand, subtitle }: Props) {
  return (
    <button
      onClick={onExpand}
      className="flex items-center gap-3 w-full text-left p-3 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all active:scale-[0.98]"
    >
      <img
        src={user.photos?.[0]?.url || user.photo}
        alt={user.name}
        className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[15px] text-gray-900 truncate">
          {user.name}, {user.age}
        </p>
        <p className="text-[13px] text-gray-500 truncate">
          {subtitle || user.occupation || user.bio?.slice(0, 60)}
        </p>
      </div>
      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export function FullProfileCard({ user, onClose, actionButton }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-[17px] text-gray-900">Profile</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Photos */}
          <PhotoCarousel
            photos={user.photos || []}
            fallbackPhoto={user.photo}
          />

          {/* Info */}
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name}, {user.age}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {user.occupation && (
                <span className="text-[13px] text-gray-500">{user.occupation}</span>
              )}
              {user.occupation && user.location && (
                <span className="text-gray-300">·</span>
              )}
              {user.location && (
                <span className="text-[13px] text-gray-500">{user.location}</span>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="px-5 pb-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Prompts */}
          {user.prompts && user.prompts.length > 0 && (
            <div className="px-5 pb-4 space-y-3">
              {user.prompts.map((p, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[13px] font-medium text-gray-400 mb-1">{p.prompt}</p>
                  <p className="text-[15px] text-gray-900 leading-relaxed">{p.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Interests */}
          {user.interests && (
            <div className="px-5 pb-6">
              <p className="text-[13px] font-medium text-gray-400 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {user.interests.split(",").map((interest, i) => (
                  <span
                    key={i}
                    className="text-[13px] text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        {actionButton && (
          <div className="px-5 py-4 border-t border-gray-50 pb-safe">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileCard(props: Props) {
  const [expanded, setExpanded] = useState(false);

  if (props.variant === "full") {
    return <FullProfileCard {...props} />;
  }

  // Parent-controlled mode: parent wants to manage its own expand state
  // (e.g. to attach an actionButton to the full profile). Don't shadow it.
  if (props.onExpand) {
    return <MiniProfileCard {...props} />;
  }

  // Self-managed expand
  return (
    <>
      <MiniProfileCard {...props} onExpand={() => setExpanded(true)} />
      {expanded && (
        <FullProfileCard
          {...props}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
}
