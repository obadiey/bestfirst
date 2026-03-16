"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RoleToggle from "./RoleToggle";
import RoleSwitchDialog from "./RoleSwitchDialog";

type NavbarProps = {
  user: { id: string; name: string; role: string; activeRole: string; credits: number } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState("");
  const [credits, setCredits] = useState(user?.credits ?? 0);

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  }

  function handleToggle(newRole: string) {
    setPendingRole(newRole);
    setShowDialog(true);
  }

  async function handleConfirmSwitch() {
    const res = await fetch("/api/users/switch-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: pendingRole }),
    });
    if (res.ok) {
      const data = await res.json();
      setCredits(data.user.credits);
    }
    setShowDialog(false);
    router.refresh();
  }

  const activeRole = user?.activeRole || user?.role || "INVITER";
  const borderColor = activeRole === "INVITER" ? "border-inviter-500" : "border-invitee-500";

  return (
    <>
      <nav className={`bg-white border-b-2 ${borderColor} px-6 py-3`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-brand-600">
            Best First Date
          </Link>
          {user && (
            <div className="flex items-center gap-4">
              <RoleToggle activeRole={activeRole} onSwitch={handleToggle} />
              <span className="text-sm text-gray-500">
                {activeRole === "INVITER" && (
                  <span className={`bg-inviter-100 text-inviter-700 px-2 py-1 rounded-full text-xs font-medium mr-2`}>
                    {credits} credits
                  </span>
                )}
                {user.name}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-brand-600"
              >
                Dashboard
              </Link>
              <Link
                href="/experiences"
                className="text-sm text-gray-600 hover:text-brand-600"
              >
                Browse
              </Link>
              {activeRole === "INVITER" && (
                <Link
                  href="/experiences/create"
                  className="text-sm text-gray-600 hover:text-brand-600"
                >
                  Create Date
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm text-gray-600 hover:text-brand-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
      {user && (
        <RoleSwitchDialog
          isOpen={showDialog}
          targetRole={pendingRole}
          currentCredits={credits}
          onConfirm={handleConfirmSwitch}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
