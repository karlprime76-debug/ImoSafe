export type FavoriteStore = { propertyIds: string[] };
export type VisitRequestStoreItem = {
  id: string;
  propertyId: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  createdAt: string;
};

export type ScamReportStoreItem = {
  id: string;
  propertyId?: string;
  reason: string;
  description?: string;
  phoneOrContact?: string;
  createdAt: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
};

export type DraftPropertyStoreItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  transactionType: string;
  price: number;
  city: string;
  neighborhood?: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  createdAt: string;
  verificationStatus: "NOT_VERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | "SUSPICIOUS";
};

export type RecentStore = { propertyIds: string[] };

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getKey(key: string) {
  return `imosafe:${key}`;
}

export function getFavorites(): FavoriteStore {
  if (typeof window === "undefined") return { propertyIds: [] };
  return safeParse<FavoriteStore>(window.localStorage.getItem(getKey("favorites"))) ?? { propertyIds: [] };
}

export function toggleFavorite(propertyId: string): FavoriteStore {
  const current = getFavorites();
  const set = new Set(current.propertyIds);
  if (set.has(propertyId)) set.delete(propertyId);
  else set.add(propertyId);
  const next = { propertyIds: Array.from(set) };
  window.localStorage.setItem(getKey("favorites"), JSON.stringify(next));
  window.dispatchEvent(new Event("imosafe:favorites"));
  return next;
}

export function getVisitRequests(): VisitRequestStoreItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<VisitRequestStoreItem[]>(window.localStorage.getItem(getKey("visitRequests"))) ?? [];
}

export function addVisitRequest(input: Omit<VisitRequestStoreItem, "id" | "createdAt">): VisitRequestStoreItem {
  const list = getVisitRequests();
  const item: VisitRequestStoreItem = {
    ...input,
    id: `vr_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [item, ...list].slice(0, 50);
  window.localStorage.setItem(getKey("visitRequests"), JSON.stringify(next));
  window.dispatchEvent(new Event("imosafe:visitRequests"));
  return item;
}

export function getScamReports(): ScamReportStoreItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<ScamReportStoreItem[]>(window.localStorage.getItem(getKey("scamReports"))) ?? [];
}

export function addScamReport(input: Omit<ScamReportStoreItem, "id" | "createdAt" | "status">): ScamReportStoreItem {
  const list = getScamReports();
  const item: ScamReportStoreItem = {
    ...input,
    id: `sr_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    status: "OPEN",
  };
  const next = [item, ...list].slice(0, 100);
  window.localStorage.setItem(getKey("scamReports"), JSON.stringify(next));
  window.dispatchEvent(new Event("imosafe:scamReports"));
  return item;
}

export function getDraftProperties(): DraftPropertyStoreItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<DraftPropertyStoreItem[]>(window.localStorage.getItem(getKey("draftProperties"))) ?? [];
}

export function addDraftProperty(input: Omit<DraftPropertyStoreItem, "id" | "createdAt" | "verificationStatus">): DraftPropertyStoreItem {
  const list = getDraftProperties();
  const item: DraftPropertyStoreItem = {
    ...input,
    id: `dp_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    verificationStatus: "PENDING",
  };
  const next = [item, ...list].slice(0, 50);
  window.localStorage.setItem(getKey("draftProperties"), JSON.stringify(next));
  window.dispatchEvent(new Event("imosafe:draftProperties"));
  return item;
}

export function getRecent(): RecentStore {
  if (typeof window === "undefined") return { propertyIds: [] };
  return safeParse<RecentStore>(window.localStorage.getItem(getKey("recent"))) ?? { propertyIds: [] };
}

export function pushRecent(propertyId: string): RecentStore {
  const current = getRecent();
  const nextIds = [propertyId, ...current.propertyIds.filter((id) => id !== propertyId)].slice(0, 12);
  const next = { propertyIds: nextIds };
  window.localStorage.setItem(getKey("recent"), JSON.stringify(next));
  window.dispatchEvent(new Event("imosafe:recent"));
  return next;
}
