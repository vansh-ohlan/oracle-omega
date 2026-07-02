"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDailyLog, Activity } from "@/lib/api";
import { isLoggedIn, clearToken } from "@/lib/auth";

export default function DailyLoggerPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sleepHours, setSleepHours] = useState(7);
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [confidence, setConfidence] = useState(5);
  const [thought, setThought] = useState("");
  const [activities, setActivities] = useState<Activity[]>([
    { name: "", type: "class", time: "", understanding_pct: 50, notes: "" },
  ]);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  function updateActivity(index: number, field: keyof Activity, value: string | number) {
    setActivities((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addActivity() {
    setActivities((prev) => [
      ...prev,
      { name: "", type: "class", time: "", understanding_pct: 50, notes: "" },
    ]);
  }

  function removeActivity(index: number) {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      await createDailyLog({
        date,
        sleep_hours: sleepHours,
        mood,
        stress,
        confidence,
        free_text_thought: thought,
        activities_json: activities.filter((a) => a.name.trim() !== ""),
      });
      setStatus("saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (!checked) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Daily Log</h1>
            <p className="text-neutral-400 text-sm">
              Module 2 — feeds every other prediction in ORACLE Ω.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-500 hover:text-neutral-300 transition"
          >
            Log out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Sleep (hours)</label>
            <input
              type="number"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-neutral-400">Activities</label>
              <button
                type="button"
                onClick={addActivity}
                className="text-xs text-neutral-300 border border-neutral-700 rounded-md px-2 py-1 hover:bg-neutral-800 transition"
              >
                + Add activity
              </button>
            </div>

            <div className="space-y-3">
              {activities.map((activity, i) => (
                <div key={i} className="border border-neutral-800 rounded-md p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Activity name (e.g. Computer Networks)"
                      value={activity.name}
                      onChange={(e) => updateActivity(i, "name", e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
                    />
                    {activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActivity(i)}
                        className="text-neutral-500 hover:text-red-400 px-2 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={activity.type}
                      onChange={(e) => updateActivity(i, "type", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-2 text-sm"
                    >
                      <option value="class">Class</option>
                      <option value="workout">Workout</option>
                      <option value="meeting">Meeting</option>
                      <option value="personal">Personal</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="time"
                      value={activity.time}
                      onChange={(e) => updateActivity(i, "time", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-2 text-sm"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Understanding %"
                      value={activity.understanding_pct ?? ""}
                      onChange={(e) =>
                        updateActivity(i, "understanding_pct", parseInt(e.target.value))
                      }
                      className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-2 text-sm"
                    />
                  </div>
                  <textarea
                    placeholder="What did you feel or notice during this?"
                    value={activity.notes ?? ""}
                    onChange={(e) => updateActivity(i, "notes", e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Mood: {mood}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Stress: {stress}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Confidence: {confidence}/10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Overall thought / note</label>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              rows={3}
              placeholder="What's on your mind overall today?"
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

          {status === "saved" && <p className="text-sm text-green-400">Saved to ORACLE Ω.</p>}
          {status === "error" && (
            <p className="text-sm text-red-400">Couldn't save — check you're logged in.</p>
          )}
        </form>
      </div>
    </main>
  );
}
