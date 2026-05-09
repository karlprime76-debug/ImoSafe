export type MockRole = "USER" | "OWNER" | "AGENCY" | "HOST" | "ADMIN";

export type MockSession = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: MockRole;
  createdAt: string;
};

const KEY = "imosafe:session";

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockSession;
    if (!parsed || typeof parsed.id !== "string" || typeof parsed.email !== "string" || typeof parsed.role !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setMockSession(session: MockSession) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("imosafe:session"));
}

export function clearMockSession() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("imosafe:session"));
}
