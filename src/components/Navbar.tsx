"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type NavbarProps = {
  user: { id: string; name: string; role: string; credits: number } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-brand-600">
          Best First Date
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user.role === "INVITER" && (
                <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                  {user.credits} credits
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
  );
}
