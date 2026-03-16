"use client";

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
  bids?: { amount: number }[];
  _count?: { bids: number };
  winner?: {
    id: string;
    name: string;
    age: number;
    bio: string;
    photo: string;
    occupation: string;
  } | null;
  optIns?: { id: string }[];
};

const CATEGORY_EMOJI: Record<string, string> = {
  Dining: "🍽️",
  Drinks: "🍸",
  Adventure: "⛷️",
  Culture: "🎨",
  Outdoors: "🌿",
  Entertainment: "🎭",
  Custom: "✨",
};

type Props = {
  experience: Experience;
  role: "INVITER" | "INVITEE";
  onAction?: (id: string) => void;
  actionLabel?: string;
  actionDisabled?: boolean;
  children?: React.ReactNode;
};

export default function ExperienceCard({
  experience,
  role,
  onAction,
  actionLabel,
  actionDisabled,
  children,
}: Props) {
  const date = new Date(experience.dateTime);
  const highestBid = experience.bids?.[0]?.amount || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className={`h-40 bg-gradient-to-br flex items-center justify-center text-5xl ${
        role === "INVITER"
          ? "from-inviter-100 to-inviter-200"
          : "from-invitee-100 to-invitee-200"
      }`}>
        {CATEGORY_EMOJI[experience.category] || "📅"}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900">
            {experience.title}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {experience.category}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {experience.description}
        </p>
        <div className="text-xs text-gray-400 space-y-1 mb-4">
          <p>📍 {experience.location}</p>
          <p>📅 {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>

        {role === "INVITER" && experience.status === "OPEN" && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">
              {highestBid > 0
                ? `Current bid: ${highestBid} credits`
                : `Min bid: ${experience.minimumBid} credits`}
            </span>
            {experience._count && (
              <span className="text-gray-400 ml-2">
                · {experience._count.bids} bid{experience._count.bids !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {role === "INVITEE" && experience.winner && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
            <img
              src={experience.winner.photo}
              alt={experience.winner.name}
              className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div>
              <p className="text-sm font-medium">{experience.winner.name}, {experience.winner.age}</p>
              <p className="text-xs text-gray-500">{experience.winner.occupation || experience.winner.bio.slice(0, 50)}</p>
            </div>
          </div>
        )}

        {children}

        {onAction && actionLabel && (
          <button
            onClick={() => onAction(experience.id)}
            disabled={actionDisabled}
            className="w-full mt-2 bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
