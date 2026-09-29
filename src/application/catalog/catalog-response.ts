import { randomUUID } from "node:crypto";
import { listProducts, type CatalogRepository } from "./list-products";

type ReportError = (event: { operation: string; requestId: string }) => void;

export async function catalogResponse(repository: CatalogRepository, reportError: ReportError) {
  try {
    return Response.json({ data: await listProducts(repository) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    const requestId = randomUUID();
    reportError({ operation: "catalog.read.failed", requestId });
    return Response.json({ error: {
      code: "CATALOG_UNAVAILABLE",
      message: "Não foi possível carregar a coleção. Tente novamente mais tarde.",
      requestId,
    } }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
