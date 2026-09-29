import "server-only";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WritableCatalogRepository } from "../../application/catalog/list-products";

const catalogPath = path.join(process.cwd(), "src", "infrastructure", "catalog", "products.json");

export const catalogRepository: WritableCatalogRepository = {
  async read() {
    return JSON.parse(await readFile(catalogPath, "utf8")) as unknown;
  },
  async write(products) {
    if (process.env.VERCEL === "1") {
      throw new Error("LOCAL_STORAGE_UNAVAILABLE_ON_VERCEL");
    }
    const temporaryPath = `${catalogPath}.${process.pid}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
    await rename(temporaryPath, catalogPath);
  },
};
