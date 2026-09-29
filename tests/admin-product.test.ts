import { describe, expect, it } from "vitest";
import { adminProductInput, priceToCents } from "../src/application/admin/product-input";

const base = { id: "id", name: "Camisa", slug: "camisa", description: "", status: "draft", collection: "", fabric: "", fit: "", care: "", featured: false, seoTitle: "", seoDescription: "", variants: [], existingImages: [] };

describe("admin product input", () => {
  it.each([["199", 19900], ["199,9", 19990], ["199.90", 19990]])("converts %s to cents", (value, cents) => {
    expect(priceToCents(value as string)).toBe(cents);
  });
  it("accepts a draft without variants", () => {
    expect(adminProductInput.parse(base).status).toBe("draft");
  });
  it.each(["-1", "1.999", "abc"])("rejects invalid price %s", (price) => {
    const input = { ...base, variants: [{ id: "v", sku: "sku", size: "M", color: "Azul", price, stock: 0 }] };
    expect(() => adminProductInput.parse(input)).toThrow();
  });
});
