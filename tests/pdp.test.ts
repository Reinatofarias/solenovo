import { describe, expect, it } from "vitest";
import { getProductBySlug } from "../src/application/catalog/get-product";

function makeProduct(status = "published", slug = "camisa-oxford", id = "prod-1") {
  return {
    id,
    slug,
    name: "Camisa Oxford Clássica",
    description: "Algodão nobre de fio duplo.",
    status,
    collection: "Coleção Permanente",
    fabric: "100% Algodão",
    fit: "Regular Fit",
    care: "Lavar a 30°C",
    featured: true,
    seoTitle: "Camisa Oxford",
    seoDescription: "Camisa em algodão nobre.",
    images: [{ src: "/oxford.jpg", alt: "Foto da camisa oxford" }],
    variants: [
      { id: `${id}-var-1`, sku: `${id}-OXF-1`, size: "M", color: "Azul Céu", priceInCents: 45000, stock: 5 },
      { id: `${id}-var-2`, sku: `${id}-OXF-2`, size: "G", color: "Azul Céu", priceInCents: 45000, stock: 0 },
    ],
  };
}

describe("product detail by slug", () => {
  it("finds a published product by slug and returns its public projection", async () => {
    const repo = { read: async () => [makeProduct("published", "camisa-oxford")] };
    const result = await getProductBySlug(repo, "camisa-oxford");

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Camisa Oxford Clássica");
    expect(result?.variants).toHaveLength(2);
    expect(result?.variants[0].available).toBe(true);
    expect(result?.variants[1].available).toBe(false);
    expect(result?.variants[0]).not.toHaveProperty("sku");
    expect(result?.variants[0]).not.toHaveProperty("stock");
  });

  it("returns null if product is draft or archived", async () => {
    const repo = {
      read: async () => [
        makeProduct("draft", "camisa-rascunho", "prod-draft"),
        makeProduct("archived", "camisa-arquivada", "prod-archived"),
      ],
    };
    expect(await getProductBySlug(repo, "camisa-rascunho")).toBeNull();
    expect(await getProductBySlug(repo, "camisa-arquivada")).toBeNull();
  });

  it("returns null for non-existing slug", async () => {
    const repo = { read: async () => [makeProduct("published", "camisa-oxford")] };
    expect(await getProductBySlug(repo, "slug-inexistente")).toBeNull();
  });
});
