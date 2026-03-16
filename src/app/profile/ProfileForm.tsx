"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleToggle from "@/components/RoleToggle";
import RoleSwitchDialog from "@/components/RoleSwitchDialog";

type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photo: string;
  role: string;
  activeRole: string;
  location: string;
  occupation: string;
  interests: string;
  credits: number;
};

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    age: user.age,
    bio: user.bio,
    photo: user.photo,
    location: user.location,
    occupation: user.occupation,
    interests: user.interests,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState("");
  const [credits, setCredits] = useState(user.credits);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setLoading(false);
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

  const activeRole = user.activeRole || user.role;
  const roleBadgeClass = activeRole === "INVITER"
    ? "bg-inviter-100 text-inviter-700"
    : "bg-invitee-100 text-invitee-700";

  return (
    <>
      <form onSubmit={handleSave} className="bg-white rounded-xl border p-6 space-y-5">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={form.photo}
            alt={form.name}
            className="w-20 h-20 rounded-full bg-gray-200"
          />
          <div>
            <p className="font-semibold text-lg">{form.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeClass}`}>
                {activeRole === "INVITER" ? "Inviter" : "Invitee"} · {credits} credits
              </span>
              <span className="text-xs text-gray-400">
                Signed up as {user.role === "INVITER" ? "Inviter" : "Invitee"}
              </span>
            </div>
          </div>
        </div>

        {/* Role toggle section */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Active Role</p>
            <p className="text-xs text-gray-500">Switch between planning and browsing dates</p>
          </div>
          <RoleToggle activeRole={activeRole} onSwitch={handleToggle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
          <input
            type="text"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. New York, NY"
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              placeholder="e.g. Software Engineer"
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
          <input
            type="text"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="e.g. hiking, cooking, travel"
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {saved && (
          <p className="text-green-600 text-sm">Profile saved successfully!</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <RoleSwitchDialog
        isOpen={showDialog}
        targetRole={pendingRole}
        currentCredits={credits}
        onConfirm={handleConfirmSwitch}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}
