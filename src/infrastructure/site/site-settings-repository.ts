import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  defaultSiteSettings,
  siteSettingsSchema,
  type SiteSettings,
} from "@/domain/site/site-settings";
import {
  getSupabaseServiceClient,
  isSupabaseDatabaseConfigured,
} from "@/infrastructure/database/supabase-client";

const localFile = path.join(process.cwd(), "src", "infrastructure", "site", "site-settings.json");

type SettingsRow = {
  announcement_enabled: boolean;
  announcement_left: string;
  announcement_center: string;
  announcement_right: string;
};

function fromRow(row: SettingsRow): SiteSettings {
  return siteSettingsSchema.parse({
    announcementEnabled: row.announcement_enabled,
    announcementLeft: row.announcement_left,
    announcementCenter: row.announcement_center,
    announcementRight: row.announcement_right,
  });
}

function isMissingTable(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "PGRST205");
}

async function writeLocalSettings(settings: SiteSettings) {
  await writeFile(localFile, JSON.stringify(settings, null, 2) + "\n", "utf8");
}

export async function readSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseDatabaseConfigured()) {
    const { data, error } = await getSupabaseServiceClient()
      .from("site_settings")
      .select("announcement_enabled,announcement_left,announcement_center,announcement_right")
      .eq("id", "main")
      .maybeSingle<SettingsRow>();
    if (error && !isMissingTable(error)) throw error;
    if (error) {
      try {
        return siteSettingsSchema.parse(JSON.parse(await readFile(localFile, "utf8")));
      } catch {
        return defaultSiteSettings;
      }
    }
    return data ? fromRow(data) : defaultSiteSettings;
  }

  try {
    return siteSettingsSchema.parse(JSON.parse(await readFile(localFile, "utf8")));
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  const validated = siteSettingsSchema.parse(settings);
  if (isSupabaseDatabaseConfigured()) {
    const { error } = await getSupabaseServiceClient().from("site_settings").upsert({
      id: "main",
      announcement_enabled: validated.announcementEnabled,
      announcement_left: validated.announcementLeft,
      announcement_center: validated.announcementCenter,
      announcement_right: validated.announcementRight,
      updated_at: new Date().toISOString(),
    });
    if (error && !isMissingTable(error)) throw error;
    if (error) {
      if (process.env.VERCEL) throw new Error("SITE_SETTINGS_MIGRATION_REQUIRED");
      await writeLocalSettings(validated);
    }
    return;
  }
  if (process.env.VERCEL) throw new Error("SITE_SETTINGS_DATABASE_REQUIRED");
  await writeLocalSettings(validated);
}
