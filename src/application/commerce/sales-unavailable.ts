export function salesUnavailableResponse() {
  return Response.json({ error: {
    code: "SALES_UNAVAILABLE",
    message: "As compras ainda não estão disponíveis.",
  } }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
