const API_BASE = "http://localhost:8000";

export interface DailyLogInput {
  user_id: number;
  date: string;
  sleep_hours?: number;
  class_name?: string;
  understanding_pct?: number;
  attendance_status?: string;
  mood?: number;
  stress?: number;
  confidence?: number;
  free_text_thought?: string;
}

export interface DailyLogOut extends DailyLogInput {
  id: number;
  created_at: string;
}

export async function createDailyLog(log: DailyLogInput): Promise<DailyLogOut> {
  const res = await fetch(`${API_BASE}/daily-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });
  if (!res.ok) throw new Error("Failed to create daily log");
  return res.json();
}

export async function getDailyLogs(userId: number): Promise<DailyLogOut[]> {
  const res = await fetch(`${API_BASE}/daily-logs/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch daily logs");
  return res.json();
}
