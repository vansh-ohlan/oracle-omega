"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyDailyLogs, deleteDailyLog, DailyLogOut } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function HistoryPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [logs, setLogs] = useState<DailyLogOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    setChecked(true);
    loadLogs();
  }, [router]);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await getMyDailyLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
      setError("Couldn't load logs.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this log? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDailyLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete log.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!checked) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1">History</h1>
            <p className="text-neutral-400 text-sm">Everything you've logged so far.</p>
          </div>
          <Link
            href="/"
            className="text-sm text-neutral-300 border border-neutral-700 rounded-md px-3 py-1.5 hover:bg-neutral-800 transition"
          >
            + New Log
          </Link>
        </div>

        {loading && <p className="text-neutral-500 text-sm">Loading...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && logs.length === 0 && (
          <div className="border border-neutral-800 rounded-md p-8 text-center">
            <p className="text-neutral-400 text-sm mb-3">No logs yet.</p>
            <Link href="/" className="text-sm text-neutral-100 underline">
              Log your first day
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="border border-neutral-800 rounded-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{log.date}</p>
                  <p className="text-xs text-neutral-500">
                    Sleep {log.sleep_hours ?? "—"}h &middot; Mood {log.mood ?? "—"}/10 &middot;
                    Stress {log.stress ?? "—"}/10 &middot; Confidence {log.confidence ?? "—"}/10
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  disabled={deletingId === log.id}
                  className="text-xs text-neutral-500 hover:text-red-400 transition disabled:opacity-50"
                >
                  {deletingId === log.id ? "Deleting..." : "Delete"}
                </button>
              </div>

              {log.activities_json && log.activities_json.length > 0 && (
                <div className="space-y-1 mb-2">
                  {log.activities_json.map((a, i) => (
                    <div key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-neutral-500">
                        {a.time ? `${a.time} ·` : ""} {a.type}
                      </span>
                      <span>{a.name}</span>
                      {a.understanding_pct !== undefined && (
                        <span className="text-neutral-500">({a.understanding_pct}%)</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {log.free_text_thought && (
                <p className="text-sm text-neutral-400 italic mt-2">"{log.free_text_thought}"</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
