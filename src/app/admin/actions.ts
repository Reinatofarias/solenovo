"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionToken, SESSION_COOKIE, SESSION_DURATION_SECONDS, verifyPassword } from "@/domain/admin/auth";
import { requireAdmin } from "@/infrastructure/auth/admin-session";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";
import { parseCatalog } from "@/domain/catalog/product";
import { adminProductInput, priceToCents } from "@/application/admin/product-input";
import { removeProductImage, saveProductImages } from "@/infrastructure/catalog/local-images";
import { siteSettingsSchema } from "@/domain/site/site-settings";
import { saveSiteSettings } from "@/infrastructure/site/site-settings-repository";

export type ActionState = { error?: string };

const attempts = new Map<string, { count: number; resetAt: number }>();

function requiredConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !passwordHash || !secret) throw new Error("ADMIN_NOT_CONFIGURED");
  return { email, passwordHash, secret };
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const key = email || "anonymous";
  const now = Date.now();
  const attempt = attempts.get(key);
  if (attempt && attempt.resetAt > now && attempt.count >= 5) return { error: "Muitas tentativas. Aguarde 15 minutos." };

  try {
    const config = requiredConfig();
    if (email !== config.email || !verifyPassword(password, config.passwordHash)) {
      attempts.set(key, { count: attempt && attempt.resetAt > now ? attempt.count + 1 : 1, resetAt: now + 15 * 60_000 });
      return { error: "E-mail ou senha inválidos." };
    }
    attempts.delete(key);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, createSessionToken(config.email, config.secret), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
  } catch {
    return { error: "A administração ainda não está configurada neste ambiente." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  redirect("/admin/login");
}

export async function saveProductAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  let savedSources: string[] = [];
  try {
    const variants = JSON.parse(String(formData.get("variants") ?? "[]")) as unknown;
    const existingImages = JSON.parse(String(formData.get("existingImages") ?? "[]")) as unknown;
    const parsed = adminProductInput.parse({
      id: String(formData.get("id") || randomUUID()),
      name: formData.get("name"), slug: formData.get("slug"), description: formData.get("description"),
      status: formData.get("status"), collection: formData.get("collection"), fabric: formData.get("fabric"),
      fit: formData.get("fit"), care: formData.get("care"), featured: formData.get("featured") === "on",
      seoTitle: formData.get("seoTitle"), seoDescription: formData.get("seoDescription"), variants, existingImages,
    });
    const files = formData.getAll("images").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (parsed.existingImages.length + files.length > 20) return { error: "Cada produto pode ter no máximo 20 imagens." };
    savedSources = await saveProductImages(files);
    const images = [
      ...parsed.existingImages,
      ...savedSources.map((src, index) => ({ src, alt: `${parsed.name} — imagem ${parsed.existingImages.length + index + 1}` })),
    ];
    const product = {
      ...parsed,
      images,
      variants: parsed.variants.map((variant) => ({
        id: variant.id, sku: variant.sku, size: variant.size, color: variant.color,
        priceInCents: priceToCents(variant.price), stock: variant.stock,
      })),
    };
    const products = parseCatalog(await catalogRepository.read());
    const previous = products.find((item) => item.id === product.id);
    const next = previous ? products.map((item) => item.id === product.id ? product : item) : [...products, product];
    const validated = parseCatalog(next);
    const validatedProduct = validated.find((item) => item.id === product.id);
    if (!validatedProduct) throw new Error("PRODUCT_VALIDATION_FAILED");
    await catalogRepository.save(validatedProduct);
    const retained = new Set(images.map((image) => image.src));
    await Promise.allSettled((previous?.images ?? []).filter((image) => !retained.has(image.src)).map((image) => removeProductImage(image.src)));
    revalidatePath("/admin"); revalidatePath("/admin/produtos"); revalidatePath("/produtos");
  } catch (error) {
    await Promise.allSettled(savedSources.map(removeProductImage));
    if (error instanceof SyntaxError) return { error: "Os dados de variantes ou imagens estão inválidos." };
    if (error instanceof Error && error.message.includes("Duplicate")) return { error: "Slug, SKU ou identificador duplicado." };
    if (error instanceof Error && error.message === "LOCAL_STORAGE_UNAVAILABLE_ON_VERCEL") return { error: "O banco aceita os dados, mas o envio de imagens ainda precisa do Supabase Storage." };
    if (error instanceof Error && error.message.startsWith("Use imagens")) return { error: error.message };
    if (error instanceof Error && error.message.startsWith("Envie no máximo")) return { error: error.message };
    return { error: "Revise os campos obrigatórios e tente novamente." };
  }
  redirect("/admin/produtos");
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await catalogRepository.archive(id);
  revalidatePath("/admin"); revalidatePath("/admin/produtos"); revalidatePath("/produtos");
  redirect("/admin/produtos");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();
  const settings = siteSettingsSchema.parse({
    announcementEnabled: formData.get("announcementEnabled") === "on",
    announcementLeft: formData.get("announcementLeft"),
    announcementCenter: formData.get("announcementCenter"),
    announcementRight: formData.get("announcementRight"),
  });
  await saveSiteSettings(settings);
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  redirect("/admin/configuracoes?salvo=1");
}
