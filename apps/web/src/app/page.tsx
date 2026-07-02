"use client";

import { useState } from "react";
import { createDailyLog } from "@/lib/api";

export default function DailyLoggerPage() {
  const [form, setForm] = useState({
    user_id: 1,
    date: new Date().toISOString().split("T")[0],
    sleep_hours: 7,
    class_name: "",
    understanding_pct: 50,
    attendance_status: "",
    mood: 5,
    stress: 5,
    confidence: 5,
    free_text_thought: "",
  });

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      await createDailyLog(form);
      setStatus("saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Daily Log</h1>
        <p className="text-neutral-400 mb-8 text-sm">
          Module 2 — feeds every other prediction in ORACLE Ω.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Sleep (hours)</label>
            <input
              type="number"
              step="0.5"
              value={form.sleep_hours}
              onChange={(e) => updateField("sleep_hours", parseFloat(e.target.value))}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Class</label>
            <input
              type="text"
              value={form.class_name}
              onChange={(e) => updateField("class_name", e.target.value)}
              placeholder="e.g. Computer Networks"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Understanding: {form.understanding_pct}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.understanding_pct}
              onChange={(e) => updateField("understanding_pct", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Attendance</label>
            <input
              type="text"
              value={form.attendance_status}
              onChange={(e) => updateField("attendance_status", e.target.value)}
              placeholder="e.g. Present but distracted"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Mood: {form.mood}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={form.mood}
                onChange={(e) => updateField("mood", parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Stress: {form.stress}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={form.stress}
                onChange={(e) => updateField("stress", parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Confidence: {form.confidence}/10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={form.confidence}
                onChange={(e) => updateField("confidence", parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Thought / note</label>
            <textarea
              value={form.free_text_thought}
              onChange={(e) => updateField("free_text_thought", e.target.value)}
              rows={3}
              placeholder="What's on your mind?"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-neutral-100 text-neutral-900 font-medium rounded-md py-2.5 text-sm hover:bg-neutral-300 transition disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Save Log"}
          </button>

          {status === "saved" && (
            <p className="text-sm text-green-400">Saved to ORACLE Ω.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">
              Couldn't save — is the backend running on port 8000?
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
