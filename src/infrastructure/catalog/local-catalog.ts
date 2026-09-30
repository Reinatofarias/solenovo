import "server-only";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseCatalog } from "../../domain/catalog/product";
import { isSupabaseDatabaseConfigured } from "../database/supabase-client";
import { supabaseCatalogRepository } from "./supabase-catalog";
import type { WritableCatalogRepository } from "../../application/catalog/list-products";

const catalogPath = path.join(process.cwd(), "src", "infrastructure", "catalog", "products.json");

async function readLocal() {
  return JSON.parse(await readFile(catalogPath, "utf8")) as unknown;
}

async function writeLocal(products: unknown) {
  const temporaryPath = `${catalogPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await rename(temporaryPath, catalogPath);
}

function assertLocalCatalogAllowed() {
  if (process.env.VERCEL === "1") throw new Error("SUPABASE_DATABASE_CONFIG_MISSING");
}

export const catalogRepository: WritableCatalogRepository = {
  async read() {
    if (isSupabaseDatabaseConfigured()) return supabaseCatalogRepository.read();
    assertLocalCatalogAllowed();
    return readLocal();
  },
  async save(product) {
    if (isSupabaseDatabaseConfigured()) return supabaseCatalogRepository.save(product);
    assertLocalCatalogAllowed();
    const [validatedProduct] = parseCatalog([product]);
    const products = parseCatalog(await readLocal());
    const existing = products.findIndex((item) => item.id === validatedProduct.id);
    const next = existing < 0
      ? [...products, validatedProduct]
      : products.map((item, index) => index === existing ? validatedProduct : item);
    await writeLocal(parseCatalog(next));
  },
  async archive(id) {
    if (isSupabaseDatabaseConfigured()) return supabaseCatalogRepository.archive(id);
    assertLocalCatalogAllowed();
    const products = parseCatalog(await readLocal());
    await writeLocal(parseCatalog(products.map((product) => product.id === id
      ? { ...product, status: "archived" }
      : product)));
  },
};
