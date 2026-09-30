import "server-only";
import {
  getSupabaseServiceClient,
  isSupabaseDatabaseConfigured,
} from "@/infrastructure/database/supabase-client";

export type LocationSummary = {
  country: string;
  region: string;
  city: string;
  views: number;
};

function isMissingTable(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "PGRST205");
}

export async function recordLocation(input: Omit<LocationSummary, "views">) {
  if (!isSupabaseDatabaseConfigured()) return;
  const { error } = await getSupabaseServiceClient().from("visitor_location_events").insert({
    country: input.country,
    region: input.region,
    city: input.city,
  });
  if (error && !isMissingTable(error)) throw error;
}

export async function readLocationSummary(days = 30): Promise<LocationSummary[]> {
  if (!isSupabaseDatabaseConfigured()) return [];
  const since = new Date(Date.now() - Math.max(1, Math.min(days, 365)) * 86_400_000).toISOString();
  const { data, error } = await getSupabaseServiceClient()
    .from("visitor_location_events")
    .select("country,region,city")
    .gte("viewed_at", since)
    .limit(10_000);
  if (error && !isMissingTable(error)) throw error;
  if (error) return [];
  const grouped = new Map<string, LocationSummary>();
  for (const row of data ?? []) {
    const country = String(row.country ?? "Desconhecido");
    const region = String(row.region ?? "Desconhecido");
    const city = String(row.city ?? "Desconhecida");
    const key = JSON.stringify([country, region, city]);
    const current = grouped.get(key);
    grouped.set(key, { country, region, city, views: (current?.views ?? 0) + 1 });
  }
  return [...grouped.values()].sort((a, b) => b.views - a.views);
}
