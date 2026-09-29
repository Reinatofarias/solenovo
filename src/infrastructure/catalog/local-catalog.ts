import "server-only";
import type { CatalogRepository } from "../../application/catalog/list-products";
import products from "./products.json";

export const catalogRepository: CatalogRepository = {
  async read() { return products; },
};
