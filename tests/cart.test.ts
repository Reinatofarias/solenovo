import { describe, expect, it } from "vitest";
import { calculateCart } from "../src/application/cart/calculate-cart";

function makeCatalog() {
  return [
    {
      id: "prod-1",
      slug: "camisa-linho",
      name: "Camisa de Linho Puro",
      description: "Linho italiano com toque macio.",
      status: "published",
      collection: "Verão",
      fabric: "100% Linho",
      fit: "Slim Fit",
      care: "Lavar à mão",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      images: [{ src: "/linho.jpg", alt: "Camisa de linho" }],
      variants: [
        { id: "var-1", sku: "LIN-1", size: "M", color: "Cru", priceInCents: 52000, stock: 3 },
        { id: "var-2", sku: "LIN-2", size: "G", color: "Cru", priceInCents: 52000, stock: 0 },
      ],
    },
    {
      id: "prod-draft",
      slug: "camisa-secreta",
      name: "Camisa Secreta",
      description: "Ainda não lançada.",
      status: "draft",
      collection: "",
      fabric: "",
      fit: "",
      care: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      images: [],
      variants: [],
    },
  ];
}

describe("cart calculation and server validation", () => {
  const repo = { read: async () => makeCatalog() };

  it("calculates lines, totals and enforces server pricing", async () => {
    const rawItems = [
      {
        productId: "prod-1",
        variantId: "var-1",
        quantity: 2,
        priceInCents: 100, // Preço adulterado no client que deve ser ignorado
      },
    ];

    const result = await calculateCart(repo, rawItems);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].unitPriceInCents).toBe(52000); // Preço oficial do servidor
    expect(result.lines[0].totalPriceInCents).toBe(104000);
    expect(result.subtotalInCents).toBe(104000);
    expect(result.totalItems).toBe(2);
    expect(result.hasUnavailableItems).toBe(false);
  });

  it("flags unavailable items when stock is 0", async () => {
    const rawItems = [
      { productId: "prod-1", variantId: "var-2", quantity: 1 },
    ];

    const result = await calculateCart(repo, rawItems);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].available).toBe(false);
    expect(result.hasUnavailableItems).toBe(true);
  });

  it("ignores non-published or non-existing products", async () => {
    const rawItems = [
      { productId: "prod-draft", variantId: "any", quantity: 1 },
      { productId: "unknown", variantId: "any", quantity: 1 },
    ];

    const result = await calculateCart(repo, rawItems);
    expect(result.lines).toHaveLength(0);
    expect(result.subtotalInCents).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it("handles malformed input safely", async () => {
    expect((await calculateCart(repo, null)).lines).toEqual([]);
    expect((await calculateCart(repo, "invalid")).lines).toEqual([]);
    expect((await calculateCart(repo, [{ quantity: -1 }])).lines).toEqual([]);
  });
});
