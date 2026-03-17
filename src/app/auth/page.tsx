"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "login" ? "login" : "signup"
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState<"INVITER" | "INVITEE">("INVITER");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? { action: "signup", email, name, age: parseInt(age), role, bio }
            : { action: "login", email }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white px-6">
      <div className="max-w-sm mx-auto w-full">
        <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight mb-8 block">
          bestfirst
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-[15px] text-gray-400 mb-8">
          {mode === "signup" ? "Start planning amazing dates" : "Sign in to continue"}
        </p>

        {/* Mode toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium transition ${
              mode === "signup" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium transition ${
              mode === "login" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"
            }`}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
              placeholder="you@email.com"
              required
            />
          </div>

          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
                    placeholder="25"
                    required
                    min={18}
                    max={99}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-2">I want to...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("INVITER")}
                    className={`py-3.5 rounded-xl text-[14px] font-medium border transition ${
                      role === "INVITER"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    Plan & Invite
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("INVITEE")}
                    className={`py-3.5 rounded-xl text-[14px] font-medium border transition ${
                      role === "INVITEE"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    Browse & Accept
                  </button>
                </div>
                <p className="text-[12px] text-gray-400 mt-2 text-center">
                  You can switch roles anytime
                </p>
              </div>
            </>
          )}

          {error && (
            <p className="text-red-500 text-[14px] text-center bg-red-50 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-[15px] font-medium hover:bg-gray-800 transition disabled:opacity-40 active:scale-[0.98]"
          >
            {loading ? "..." : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
