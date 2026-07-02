import { getToken } from "./auth";

const API_BASE = "http://localhost:8000";

export interface Activity {
  name: string;
  type?: string;
  time?: string;
  understanding_pct?: number;
  notes?: string;
}

export interface DailyLogInput {
  date: string;
  sleep_hours?: number;
  activities_json?: Activity[];
  mood?: number;
  stress?: number;
  confidence?: number;
  free_text_thought?: string;
}

export interface DailyLogOut extends DailyLogInput {
  id: number;
  user_id: number;
  created_at: string;
}

export interface UserOut {
  id: number;
  name: string;
  email: string;
  timezone: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserOut;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const formBody = new URLSearchParams();
  formBody.append("username", email);
  formBody.append("password", password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export async function createDailyLog(log: DailyLogInput): Promise<DailyLogOut> {
  const res = await fetch(`${API_BASE}/daily-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(log),
  });
  if (!res.ok) throw new Error("Failed to create daily log");
  return res.json();
}

export async function getMyDailyLogs(): Promise<DailyLogOut[]> {
  const res = await fetch(`${API_BASE}/daily-logs`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch daily logs");
  return res.json();
}
