const TOKEN_KEY = "oracle_token";

export function saveToken(token: string) {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800`;
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${TOKEN_KEY}=([^;]+)`));
  return match ? match[1] : null;
}

export function clearToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}
