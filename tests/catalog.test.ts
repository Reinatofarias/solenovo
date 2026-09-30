import { describe, expect, it, vi } from "vitest";
import { parseCatalog } from "../src/domain/catalog/product";
import { listProducts } from "../src/application/catalog/list-products";
import { catalogResponse } from "../src/application/catalog/catalog-response";
import products from "../src/infrastructure/catalog/products.json";

function fixture() {
  return {
    id: "test-product", slug: "camisa-teste", name: "Fixture de teste", description: "Somente para testes.",
    status: "published", costInCents: 100,
    images: [{ src: "/test-shirt.webp", alt: "Imagem de teste" }],
    variants: [{ id: "variant-1", sku: "TEST-1", size: "Tamanho de teste", color: "Cor de teste", priceInCents: 10000, stock: 2 }],
  };
}

describe("catalog boundary", () => {
  it("ships with an empty catalog, without demo products", () => {
    expect(parseCatalog(products)).toEqual([]);
  });
  it("excludes drafts and strips private fields from published products", async () => {
    const draft = { ...fixture(), id: "draft", slug: "draft", status: "draft", variants: [] };
    const result = await listProducts({ read: async () => [fixture(), draft] });
    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty("costInCents");
    expect(result[0].variants[0]).not.toHaveProperty("sku");
    expect(result[0].variants[0]).not.toHaveProperty("stock");
    expect(result[0].variants[0].available).toBe(true);
  });
  it("reports unavailable variants without exposing stock quantities", async () => {
    const product = fixture();
    product.variants[0].stock = 0;
    expect((await listProducts({ read: async () => [product] }))[0].variants[0].available).toBe(false);
  });
  it.each([-1, 0, 1.5, Number.MAX_SAFE_INTEGER + 1])("rejects invalid price %s", (price) => {
    const product = fixture(); product.variants[0].priceInCents = price;
    expect(() => parseCatalog([product])).toThrow();
  });
  it.each([-1, 1.5])("rejects invalid stock %s", (stock) => {
    const product = fixture(); product.variants[0].stock = stock;
    expect(() => parseCatalog([product])).toThrow();
  });
  it("requires images and variants for publication", () => {
    expect(() => parseCatalog([{ ...fixture(), images: [] }])).toThrow();
    expect(() => parseCatalog([{ ...fixture(), variants: [] }])).toThrow();
  });
  it("rejects duplicate slugs and globally duplicate SKUs", () => {
    const first = fixture();
    expect(() => parseCatalog([first, { ...first, id: "second" }])).toThrow();
    expect(() => parseCatalog([first, { ...first, id: "second", slug: "second", variants: [{ ...first.variants[0], id: "second-variant" }] }])).toThrow();
  });
  it.each(["https://example.com/image.jpg", "//example.com/image.jpg", "/../secret.jpg"])("rejects unsafe image source %s", (src) => {
    expect(() => parseCatalog([{ ...fixture(), images: [{ src, alt: "Teste" }] }])).toThrow();
  });
  it("accepts images stored in the public Supabase product bucket", () => {
    expect(() => parseCatalog([{
      ...fixture(),
      images: [{
        src: "https://project.supabase.co/storage/v1/object/public/product-images/products/test/image.webp",
        alt: "Imagem WebP",
      }],
    }])).not.toThrow();
  });
  it("sanitizes failures and provides correlation without logging raw data", async () => {
    const report = vi.fn();
    const response = await catalogResponse({ read: async () => { throw new Error("secret database url"); } }, report);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error.code).toBe("CATALOG_UNAVAILABLE");
    expect(body.error.requestId).toBeTruthy();
    expect(JSON.stringify(body)).not.toContain("secret");
    expect(report).toHaveBeenCalledWith({ operation: "catalog.read.failed", requestId: body.error.requestId });
  });
});
