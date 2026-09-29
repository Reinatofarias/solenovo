import { parseCatalog, toPublicProduct, type PublicProduct } from "../../domain/catalog/product";
import type { CatalogRepository } from "./list-products";

export async function getProductBySlug(
  repository: CatalogRepository,
  slug: string
): Promise<PublicProduct | null> {
  const products = parseCatalog(await repository.read());
  const match = products.find((product) => product.slug === slug && product.status === "published");
  if (!match) return null;
  return toPublicProduct(match);
}
