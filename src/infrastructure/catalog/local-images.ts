import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_IMAGES = 12;
const MAX_SIZE = 8 * 1024 * 1024;
const allowed = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"],
]);

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");

export async function saveProductImages(files: File[]) {
  if (process.env.VERCEL === "1" && files.length > 0) throw new Error("LOCAL_STORAGE_UNAVAILABLE_ON_VERCEL");
  if (files.length > MAX_IMAGES) throw new Error("Envie no máximo 12 imagens por vez.");
  await mkdir(uploadDirectory, { recursive: true });
  const saved: string[] = [];
  try {
    for (const file of files) {
      const extension = allowed.get(file.type);
      if (!extension || file.size <= 0 || file.size > MAX_SIZE) throw new Error("Use imagens JPEG, PNG, WebP ou AVIF de até 8 MB.");
      const name = `${randomUUID()}.${extension}`;
      await writeFile(path.join(uploadDirectory, name), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
      saved.push(`/uploads/products/${name}`);
    }
    return saved;
  } catch (error) {
    await Promise.allSettled(saved.map(removeProductImage));
    throw error;
  }
}

export async function removeProductImage(src: string) {
  if (!/^\/uploads\/products\/[a-f0-9-]+\.(?:jpg|png|webp|avif)$/.test(src)) return;
  await unlink(path.join(process.cwd(), "public", src.slice(1))).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
}
