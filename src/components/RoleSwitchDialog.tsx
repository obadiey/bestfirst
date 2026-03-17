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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-modal p-6 max-w-sm w-full mx-4 mb-0 sm:mb-0">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Switch to {toInviter ? "Inviter" : "Invitee"}?</h2>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
          {toInviter
            ? "Plan dates and bid on experiences. You'll be browsing curated experiences to win."
            : "Browse and opt into dates. You'll see experiences that inviters have planned."}
        </p>
        {toInviter && currentCredits === 0 && (
          <div className="text-[14px] text-inviter-700 font-medium bg-inviter-50 px-4 py-3 rounded-2xl mb-4">
            You&apos;ll receive 500 credits to start bidding
          </div>
        )}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-[15px] font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl text-[15px] font-medium text-white transition ${
              toInviter
                ? "bg-inviter-600 hover:bg-inviter-700"
                : "bg-invitee-600 hover:bg-invitee-700"
            }`}
          >
            Switch
          </button>
        </div>
      </div>
    </div>
  );
}
