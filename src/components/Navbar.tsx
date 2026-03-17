"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import RoleSwitchDialog from "./RoleSwitchDialog";

type NavbarProps = {
  user: { id: string; name: string; role: string; activeRole: string; credits: number } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
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
  const isInviter = activeRole === "INVITER";

  const navItems = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/experiences", label: "Browse", icon: SearchIcon },
    ...(isInviter ? [{ href: "/experiences/create", label: "Create", icon: PlusIcon }] : []),
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <>
      {/* Top bar - minimal on mobile */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900 tracking-tight">
            bestfirst
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              {isInviter && (
                <span className="text-[12px] font-medium text-inviter-600 bg-inviter-50 px-2.5 py-1 rounded-full">
                  {credits} credits
                </span>
              )}
              <button
                onClick={() => {
                  setPendingRole(isInviter ? "INVITEE" : "INVITER");
                  setShowDialog(true);
                }}
                className={`text-[12px] font-medium px-2.5 py-1 rounded-full transition ${
                  isInviter
                    ? "bg-inviter-100 text-inviter-700"
                    : "bg-invitee-100 text-invitee-700"
                }`}
              >
                {isInviter ? "Inviter" : "Invitee"}
              </button>
              <button
                onClick={handleLogout}
                className="text-[12px] text-gray-400 hover:text-gray-600 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Bottom navigation - mobile */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-40 pb-safe">
          <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
                    active ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <item.icon active={active} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

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

// Icon components
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}
