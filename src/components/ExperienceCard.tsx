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
    photos?: { url: string }[];
    prompts?: { prompt: string; answer: string }[];
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
  onViewProfile?: () => void;
};

export default function ExperienceCard({
  experience,
  role,
  onAction,
  actionLabel,
  actionDisabled,
  children,
  onViewProfile,
}: Props) {
  const date = new Date(experience.dateTime);
  const highestBid = experience.bids?.[0]?.amount || 0;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden hover:shadow-card-hover transition-all">
      {/* Category header */}
      <div className={`px-5 pt-5 pb-3 flex items-center gap-2`}>
        <span className="text-xl">{CATEGORY_EMOJI[experience.category] || "📅"}</span>
        <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wider">
          {experience.category}
        </span>
        {experience.isCustom && (
          <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
            Custom
          </span>
        )}
      </div>

      <div className="px-5 pb-5">
        <h3 className="font-semibold text-[17px] text-gray-900 mb-1 leading-snug">
          {experience.title}
        </h3>
        <p className="text-[14px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {experience.description}
        </p>

        <div className="flex items-center gap-4 text-[13px] text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
            {experience.location}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {role === "INVITER" && experience.status === "OPEN" && (
          <div className="flex items-center justify-between py-2.5 px-3.5 bg-gray-50 rounded-xl mb-3">
            <span className="text-[13px] text-gray-600">
              {highestBid > 0
                ? `Current bid: ${highestBid}`
                : `Min: ${experience.minimumBid}`}
            </span>
            {experience._count && (
              <span className="text-[12px] text-gray-400">
                {experience._count.bids} bid{experience._count.bids !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {role === "INVITEE" && experience.winner && (
          <button
            onClick={onViewProfile}
            className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-xl mb-3 text-left hover:bg-gray-100 transition active:scale-[0.98]"
          >
            <img
              src={experience.winner.photos?.[0]?.url || experience.winner.photo}
              alt={experience.winner.name}
              className="w-11 h-11 rounded-xl object-cover bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-gray-900">
                {experience.winner.name}, {experience.winner.age}
              </p>
              <p className="text-[12px] text-gray-500 truncate">
                {experience.winner.occupation || experience.winner.bio?.slice(0, 50)}
              </p>
            </div>
            <span className="text-[12px] text-brand-600 font-medium">View</span>
          </button>
        )}

        {children}

        {onAction && actionLabel && (
          <button
            onClick={() => onAction(experience.id)}
            disabled={actionDisabled}
            className="w-full mt-2 bg-gray-900 text-white py-3 rounded-xl text-[14px] font-medium hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
