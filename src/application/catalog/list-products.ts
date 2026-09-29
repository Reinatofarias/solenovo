import { parseCatalog, toPublicProduct } from "../../domain/catalog/product";

export interface CatalogRepository {
  read(): Promise<unknown>;
}

export interface WritableCatalogRepository extends CatalogRepository {
  write(products: unknown): Promise<void>;
}

export async function listProducts(repository: CatalogRepository) {
  const products = parseCatalog(await repository.read());
  return products.filter((product) => product.status === "published").map(toPublicProduct);
}
