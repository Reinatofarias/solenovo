import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  getSupabaseProjectUrl,
  getSupabaseServiceClient,
  isSupabaseDatabaseConfigured,
} from "../database/supabase-client";

const MAX_IMAGES = 12;
const MAX_SIZE = 8 * 1024 * 1024;
const STORAGE_BUCKET = "product-images";
const allowed = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"],
]);
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");

function validateFile(file: File) {
  if (!allowed.has(file.type) || file.size <= 0 || file.size > MAX_SIZE) {
    throw new Error("Use imagens JPEG, PNG, WebP ou AVIF de até 8 MB.");
  }
}

async function saveSupabaseImages(files: File[], productId: string) {
  const client = getSupabaseServiceClient();
  const saved: string[] = [];
  try {
    for (const file of files) {
      validateFile(file);
      const extension = allowed.get(file.type);
      const objectPath = "products/" + productId + "/" + randomUUID() + "." + extension;
      const { error } = await client.storage.from(STORAGE_BUCKET).upload(
        objectPath,
        await file.arrayBuffer(),
        { contentType: file.type, upsert: false },
      );
      if (error) throw new Error("SUPABASE_STORAGE_UPLOAD_FAILED: " + error.message);
      saved.push(getSupabaseProjectUrl() + "/storage/v1/object/public/" + STORAGE_BUCKET + "/" + objectPath);
    }
    return saved;
  } catch (error) {
    await Promise.allSettled(saved.map(removeProductImage));
    throw error;
  }
}

async function saveLocalImages(files: File[]) {
  await mkdir(uploadDirectory, { recursive: true });
  const saved: string[] = [];
  try {
    for (const file of files) {
      validateFile(file);
      const extension = allowed.get(file.type);
      const name = randomUUID() + "." + extension;
      await writeFile(path.join(uploadDirectory, name), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
      saved.push("/uploads/products/" + name);
    }
    return saved;
  } catch (error) {
    await Promise.allSettled(saved.map(removeProductImage));
    throw error;
  }
}

export async function saveProductImages(files: File[], productId: string) {
  if (files.length > MAX_IMAGES) throw new Error("Envie no máximo 12 imagens por vez.");
  if (!files.length) return [];
  if (isSupabaseDatabaseConfigured()) return saveSupabaseImages(files, productId);
  if (process.env.VERCEL === "1") throw new Error("SUPABASE_STORAGE_CONFIG_MISSING");
  return saveLocalImages(files);
}

function supabaseObjectPath(src: string) {
  try {
    const url = new URL(src);
    const marker = "/storage/v1/object/public/" + STORAGE_BUCKET + "/";
    if (!url.pathname.includes(marker)) return;
    return decodeURIComponent(url.pathname.slice(url.pathname.indexOf(marker) + marker.length));
  } catch {
    return;
  }
}

export async function removeProductImage(src: string) {
  const objectPath = supabaseObjectPath(src);
  if (objectPath && isSupabaseDatabaseConfigured()) {
    const { error } = await getSupabaseServiceClient().storage.from(STORAGE_BUCKET).remove([objectPath]);
    if (error) throw new Error("SUPABASE_STORAGE_DELETE_FAILED: " + error.message);
    return;
  }
  if (!/^\/uploads\/products\/[a-f0-9-]+\.(?:jpg|png|webp|avif)$/.test(src)) return;
  await unlink(path.join(process.cwd(), "public", src.slice(1))).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
}
