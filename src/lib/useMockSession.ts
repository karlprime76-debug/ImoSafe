"use client";

import { useEffect, useState } from "react";

import type { MockSession } from "@/lib/mockSession";
import { getMockSession } from "@/lib/mockSession";

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    const read = () => setSession(getMockSession());
    read();
    window.addEventListener("imosafe:session", read);
    return () => window.removeEventListener("imosafe:session", read);
  }, []);

  return session;
}
