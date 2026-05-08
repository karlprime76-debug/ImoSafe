"use client";

import { useEffect } from "react";

import { pushRecent } from "@/lib/mockDataStore";

export function RecordRecent({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    pushRecent(propertyId);
  }, [propertyId]);

  return null;
}
