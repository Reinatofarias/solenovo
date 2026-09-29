import { z } from "zod";

const variantInput = z.object({
  id: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(200),
  size: z.string().trim().min(1).max(200),
  color: z.string().trim().min(1).max(200),
  price: z.string().regex(/^\d+(?:[.,]\d{1,2})?$/),
  stock: z.coerce.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
});

export const adminProductInput = z.object({
  id: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  description: z.string().trim().max(5000),
  status: z.enum(["draft", "published", "archived"]),
  collection: z.string().trim().max(120),
  fabric: z.string().trim().max(500),
  fit: z.string().trim().max(500),
  care: z.string().trim().max(1000),
  featured: z.boolean(),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  variants: z.array(variantInput).max(200),
  existingImages: z.array(z.object({ src: z.string(), alt: z.string().trim().min(1).max(200) })).max(20),
});

export function priceToCents(price: string) {
  const normalized = price.replace(",", ".");
  const [whole, decimal = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}
