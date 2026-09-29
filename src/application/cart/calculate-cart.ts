import { parseCatalog } from "../../domain/catalog/product";
import { type CalculatedCart, type CalculatedCartLine, cartSchema } from "../../domain/cart/cart";
import type { CatalogRepository } from "../catalog/list-products";

export async function calculateCart(
  repository: CatalogRepository,
  rawItems: unknown
): Promise<CalculatedCart> {
  const parsed = cartSchema.safeParse({ items: rawItems });
  if (!parsed.success) {
    return { lines: [], subtotalInCents: 0, totalItems: 0, hasUnavailableItems: false };
  }

  const catalog = parseCatalog(await repository.read());
  const productMap = new Map(catalog.map((product) => [product.id, product]));

  const lines: CalculatedCartLine[] = [];
  let subtotalInCents = 0;
  let totalItems = 0;
  let hasUnavailableItems = false;

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product || product.status !== "published") {
      continue;
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      continue;
    }

    const isAvailable = variant.stock > 0;
    if (!isAvailable) {
      hasUnavailableItems = true;
    }

    const lineTotal = variant.priceInCents * item.quantity;
    subtotalInCents += lineTotal;
    totalItems += item.quantity;

    lines.push({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      size: variant.size,
      color: variant.color,
      unitPriceInCents: variant.priceInCents,
      quantity: item.quantity,
      totalPriceInCents: lineTotal,
      image: product.images[0] ? { src: product.images[0].src, alt: product.images[0].alt } : null,
      available: isAvailable,
    });
  }

  return {
    lines,
    subtotalInCents,
    totalItems,
    hasUnavailableItems,
  };
}
