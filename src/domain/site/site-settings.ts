import { z } from "zod";

export const siteSettingsSchema = z.object({
  announcementEnabled: z.boolean(),
  announcementLeft: z.string().trim().max(120),
  announcementCenter: z.string().trim().max(120),
  announcementRight: z.string().trim().max(120),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const defaultSiteSettings: SiteSettings = {
  announcementEnabled: true,
  announcementLeft: "Alta Camisaria · Coleção Autoral em Preparação",
  announcementCenter: "Algodão Nobre & Linho Italiano · Corte sob Medida",
  announcementRight: "Atelier em Camaragibe, Pernambuco",
};
