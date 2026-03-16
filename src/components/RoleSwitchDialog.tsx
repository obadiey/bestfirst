"use client";

type Props = {
  isOpen: boolean;
  targetRole: string;
  currentCredits: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function RoleSwitchDialog({
  isOpen,
  targetRole,
  currentCredits,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  const toInviter = targetRole === "INVITER";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-2">Ready to switch sides?</h2>
        <p className="text-gray-600 mb-4">
          {toInviter
            ? "Time to plan something special! You\u2019ll be browsing experiences to bid on and creating dates."
            : "Looking for a great date? You\u2019ll be browsing dates that inviters have won and opting into the ones you like."}
        </p>
        {toInviter && currentCredits === 0 && (
          <p className="text-inviter-600 text-sm font-medium mb-4 bg-inviter-50 px-3 py-2 rounded-lg">
            You&apos;ll receive 500 credits to start bidding!
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
          >
            Stay here
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition ${
              toInviter
                ? "bg-inviter-600 hover:bg-inviter-700"
                : "bg-invitee-600 hover:bg-invitee-700"
            }`}
          >
            Let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
}
