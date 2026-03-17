"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROMPT_OPTIONS } from "@/lib/prompts";
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

type PromptEntry = { prompt: string; answer: string };

type Props = {
  user: User;
  initialPhotos: string[];
  initialPrompts: PromptEntry[];
};

export default function ProfileForm({ user, initialPhotos, initialPrompts }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    age: user.age,
    bio: user.bio,
    location: user.location,
    occupation: user.occupation,
    interests: user.interests,
  });
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [prompts, setPrompts] = useState<PromptEntry[]>(initialPrompts);
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
      body: JSON.stringify({
        ...form,
        photos,
        prompts: prompts.filter((p) => p.prompt && p.answer),
      }),
    });
    setSaved(true);
    setLoading(false);
  }

  function addPhoto() {
    if (newPhotoUrl && photos.length < 4) {
      setPhotos([...photos, newPhotoUrl]);
      setNewPhotoUrl("");
    }
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  function addPrompt() {
    if (prompts.length < 3) {
      setPrompts([...prompts, { prompt: "", answer: "" }]);
    }
  }

  function updatePrompt(index: number, field: "prompt" | "answer", value: string) {
    const updated = [...prompts];
    updated[index] = { ...updated[index], [field]: value };
    setPrompts(updated);
  }

  function removePrompt(index: number) {
    setPrompts(prompts.filter((_, i) => i !== index));
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

  return (
    <>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar and basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={photos[0] || user.photo}
              alt={form.name}
              className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
            />
            <div className="flex-1">
              <p className="font-semibold text-[17px] text-gray-900">{form.name}</p>
              <p className="text-[13px] text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3.5">
            <div>
              <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${
                activeRole === "INVITER"
                  ? "bg-inviter-100 text-inviter-700"
                  : "bg-invitee-100 text-invitee-700"
              }`}>
                {activeRole === "INVITER" ? "Inviter" : "Invitee"} · {credits} credits
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingRole(activeRole === "INVITER" ? "INVITEE" : "INVITER");
                setShowDialog(true);
              }}
              className="text-[13px] text-gray-500 font-medium hover:text-gray-700 transition"
            >
              Switch role
            </button>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Photos</h3>
          <p className="text-[13px] text-gray-400 mb-4">Add up to 4 photos (paste image URLs)</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 text-[11px] bg-white/90 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    Primary
                  </span>
                )}
              </div>
            ))}
            {photos.length < 4 && (
              <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-gray-300 text-2xl">+</span>
              </div>
            )}
          </div>

          {photos.length < 4 && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste image URL..."
                className="flex-1 bg-gray-50 border-0 rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={addPhoto}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition active:scale-[0.98]"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Prompts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Prompts</h3>
          <p className="text-[13px] text-gray-400 mb-4">Answer up to 3 prompts to show your personality</p>

          <div className="space-y-4">
            {prompts.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <select
                    value={p.prompt}
                    onChange={(e) => updatePrompt(i, "prompt", e.target.value)}
                    className="bg-transparent text-[13px] font-medium text-gray-600 focus:outline-none flex-1"
                  >
                    <option value="">Select a prompt...</option>
                    {PROMPT_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removePrompt(i)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <textarea
                  value={p.answer}
                  onChange={(e) => updatePrompt(i, "answer", e.target.value)}
                  placeholder="Your answer..."
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300 resize-none"
                  rows={2}
                />
              </div>
            ))}

            {prompts.length < 3 && (
              <button
                type="button"
                onClick={addPrompt}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-[14px] text-gray-400 font-medium hover:border-gray-300 hover:text-gray-500 transition"
              >
                + Add prompt
              </button>
            )}
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
          <h3 className="text-[15px] font-semibold text-gray-900">Basic Info</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. New York, NY"
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Occupation</label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                placeholder="e.g. Engineer"
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Interests</label>
            <input
              type="text"
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="e.g. hiking, cooking, travel"
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
            />
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 text-green-600 text-[14px] font-medium py-3 px-4 rounded-2xl text-center">
            Profile saved
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[15px] font-medium hover:bg-gray-800 transition disabled:opacity-40 active:scale-[0.98]"
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
