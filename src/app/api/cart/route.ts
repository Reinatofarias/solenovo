import { calculateCart } from "@/application/cart/calculate-cart";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: unknown };
    const cart = await calculateCart(catalogRepository, body.items ?? []);
    return Response.json({ data: cart }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({
      error: { code: "CART_ERROR", message: "Não foi possível validar a sacola." }
    }, { status: 400 });
  }
}
