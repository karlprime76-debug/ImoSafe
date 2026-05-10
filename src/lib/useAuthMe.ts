"use client";

import { useEffect, useState } from "react";

export type AuthMeUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "OWNER" | "AGENCY" | "HOST" | "ADMIN";
  createdAt: string;
};

type AuthMeResponse =
  | { ok: true; user: AuthMeUser | null }
  | { ok: false; error?: { code?: string; message?: string } };

export function useAuthMe() {
  const [user, setUser] = useState<AuthMeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as AuthMeResponse;
        if (!res.ok || !data.ok) {
          if (cancelled) return;
          setUser(null);
          return;
        }
        if (cancelled) return;
        setUser(data.user);
      } catch {
        if (cancelled) return;
        setUser(null);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
