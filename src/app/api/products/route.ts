import { catalogResponse } from "@/application/catalog/catalog-response";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return catalogResponse(catalogRepository, (event) => {
    console.error(JSON.stringify({ ...event, severity: "error" }));
  });
}
