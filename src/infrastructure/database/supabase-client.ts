import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | undefined;

function environmentValue(name: string) {
  let value = process.env[name]?.trim();
  value = value?.replace(/^=+\s*["']?/, "").replace(/["']$/, "").trim();
  const duplicatedPrefix = `${name}=`;
  while (value?.startsWith(duplicatedPrefix)) {
    value = value.slice(duplicatedPrefix.length).trim();
  }
  while (value && /^[A-Z][A-Z0-9_]*=/.test(value)) {
    value = value.replace(/^[A-Z][A-Z0-9_]*=/, "").trim();
  }
  return value;
}

function databaseConfig() {
  const url = environmentValue("SUPABASE_URL");
  const serviceKey = environmentValue("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:") return;
  } catch {
    return;
  }
  return { url, serviceKey };
}

export function isSupabaseDatabaseConfigured() {
  return Boolean(databaseConfig());
}

export function getSupabaseServiceClient() {
  const config = databaseConfig();
  if (!config) throw new Error("SUPABASE_DATABASE_CONFIG_INVALID");
  serviceClient ??= createClient(config.url, config.serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return serviceClient;
}
