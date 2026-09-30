import "server-only";
import { parseCatalog } from "../../domain/catalog/product";
import { getSupabaseServiceClient } from "../database/supabase-client";
import type { WritableCatalogRepository } from "../../application/catalog/list-products";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  collection: string;
  fabric: string;
  fit: string;
  care: string;
  featured: boolean;
  seo_title: string;
  seo_description: string;
  product_images: Array<{ position: number; src: string; alt: string }> | null;
  product_variants: Array<{
    id: string;
    sku: string;
    size: string;
    color: string;
    price_in_cents: number | string;
    stock: number | string;
  }> | null;
};

function mapProduct(row: ProductRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    collection: row.collection,
    fabric: row.fabric,
    fit: row.fit,
    care: row.care,
    featured: row.featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    images: (row.product_images ?? [])
      .toSorted((first, second) => first.position - second.position)
      .map(({ src, alt }) => ({ src, alt })),
    variants: (row.product_variants ?? []).map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      priceInCents: Number(variant.price_in_cents),
      stock: Number(variant.stock),
    })),
  };
}

export const supabaseCatalogRepository: WritableCatalogRepository = {
  async read() {
    const { data, error } = await getSupabaseServiceClient()
      .from("products")
      .select("*, product_images(*), product_variants(*)")
      .order("created_at", { ascending: true });
    if (error) throw new Error("SUPABASE_CATALOG_READ_FAILED");
    return (data as ProductRow[]).map(mapProduct);
  },
  async save(product) {
    const [validatedProduct] = parseCatalog([product]);
    const { error } = await getSupabaseServiceClient().rpc("save_catalog_product", {
      p_product: validatedProduct,
    });
    if (error) throw new Error("SUPABASE_CATALOG_SAVE_FAILED");
  },
  async archive(id) {
    const { error } = await getSupabaseServiceClient()
      .from("products")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error("SUPABASE_CATALOG_ARCHIVE_FAILED");
  },
};