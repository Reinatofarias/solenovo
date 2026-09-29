import { z } from "zod";

const requiredText = z.string().trim().min(1).max(200);
const localImagePath = z.string().regex(/^\/(?!\/)[a-zA-Z0-9_/-]+\.(?:avif|webp|png|jpe?g)$/);

export const productSchema = z.object({
  id: requiredText,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  name: requiredText,
  description: z.string().trim().max(5000),
  status: z.enum(["draft", "published", "archived"]),
  collection: z.string().trim().max(120).default(""),
  fabric: z.string().trim().max(500).default(""),
  fit: z.string().trim().max(500).default(""),
  care: z.string().trim().max(1000).default(""),
  featured: z.boolean().default(false),
  seoTitle: z.string().trim().max(70).default(""),
  seoDescription: z.string().trim().max(170).default(""),
  images: z.array(z.object({ src: localImagePath, alt: requiredText })).max(20),
  variants: z.array(z.object({
    id: requiredText,
    sku: requiredText,
    size: requiredText,
    color: requiredText,
    priceInCents: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    stock: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  })).max(200),
}).superRefine((product, context) => {
  if (product.status === "published" && (!product.description || !product.images.length || !product.variants.length)) {
    context.addIssue({ code: "custom", message: "Published products require description, images and variants." });
  }
});

export type Product = z.infer<typeof productSchema>;

export function parseCatalog(input: unknown): Product[] {
  const products = z.array(productSchema).parse(input);
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const variantIds = new Set<string>();
  const skus = new Set<string>();

  for (const product of products) {
    if (ids.has(product.id) || slugs.has(product.slug)) {
      throw new Error("Duplicate product identity.");
    }
    ids.add(product.id);
    slugs.add(product.slug);
    for (const variant of product.variants) {
      if (variantIds.has(variant.id) || skus.has(variant.sku)) {
        throw new Error("Duplicate variant identity.");
      }
      variantIds.add(variant.id);
      skus.add(variant.sku);
    }
  }
  return products;
}

export function toPublicProduct(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    collection: product.collection,
    fabric: product.fabric,
    fit: product.fit,
    care: product.care,
    featured: product.featured,
    images: product.images.map(({ src, alt }) => ({ src, alt })),
    variants: product.variants.map(({ id, size, color, priceInCents, stock }) => ({
      id, size, color, priceInCents, available: stock > 0,
    })),
  };
}

export type PublicProduct = ReturnType<typeof toPublicProduct>;
