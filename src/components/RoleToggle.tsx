"use client";

type Props = {
  activeRole: string;
  onSwitch: (newRole: string) => void;
};

export default function RoleToggle({ activeRole, onSwitch }: Props) {
  return (
    <div className="flex bg-gray-100 rounded-full p-0.5">
      <button
        onClick={() => activeRole !== "INVITER" && onSwitch("INVITER")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
          activeRole === "INVITER"
            ? "bg-inviter-500 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Inviter
      </button>
      <button
        onClick={() => activeRole !== "INVITEE" && onSwitch("INVITEE")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
          activeRole === "INVITEE"
            ? "bg-invitee-500 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Invitee
      </button>
    </div>
  );
}
