"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Dining", "Drinks", "Adventure", "Culture", "Outdoors", "Entertainment"];

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dining");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, location, dateTime }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
      <div>
        <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Date Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sunset picnic at the park"
          className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
          required
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the date experience..."
          className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300 resize-none"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Central Park, NYC"
          className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-300"
          required
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Date & Time</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          required
        />
      </div>

      {error && <p className="text-red-500 text-[14px] bg-red-50 py-2 px-3 rounded-xl">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-[15px] font-medium hover:bg-gray-800 transition disabled:opacity-40 active:scale-[0.98]"
      >
        {loading ? "Creating..." : "Create Date Experience"}
      </button>
    </form>
  );
}
